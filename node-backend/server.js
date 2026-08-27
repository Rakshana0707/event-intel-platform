import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { initDatabase } from './config/db.js';
import { fetchNewsAndSave } from './services/newsService.js';
import { extractEntities } from './services/entityService.js';
import { getMockOldData, getTrendingWordFrequencies } from './services/trendService.js';
import { analyzeSentiment } from './services/sentimentService.js';
import { splitIntoWords } from './utils/textParser.js';
import { removeStopWords } from './utils/stopwordRemover.js';
import { countWordFrequencies } from './utils/wordFrequencyCounter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all requests so the React UI can communicate
app.use(cors());
app.use(express.json());

// 1. Health check endpoint
app.get('/test', (req, res) => {
  res.send('System Running');
});

// 2. Fetch all articles in the database
app.get('/all', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM articles ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 3. Save a new article manually
app.post('/add', async (req, res) => {
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  try {
    const sentiment = analyzeSentiment(title, content);
    const [result] = await pool.query(
      'INSERT INTO articles (title, content, sentiment) VALUES (?, ?, ?)',
      [title, content || '', sentiment]
    );
    res.status(201).json({ id: result.insertId, title, content, sentiment });
  } catch (error) {
    console.error('Error saving article:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 4. Ingest articles from placeholder API and save to database
app.get('/fetch-news', async (req, res) => {
  try {
    const saved = await fetchNewsAndSave();
    res.json(saved);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to fetch all articles and count overall word frequencies
async function analyzeAllArticles() {
  const [rows] = await pool.query('SELECT content FROM articles');
  let allTokens = [];
  
  for (const row of rows) {
    if (row.content) {
      const words = splitIntoWords(row.content);
      allTokens.push(...words);
    }
  }
  
  const meaningfulWords = removeStopWords(allTokens);
  return countWordFrequencies(meaningfulWords);
}

// 5. Analyze and return all word frequencies
app.get('/analyze', async (req, res) => {
  try {
    const frequencies = await analyzeAllArticles();
    res.json(frequencies);
  } catch (error) {
    console.error('Error analyzing articles:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 6. Compare current frequencies with mock baseline to find trending words
app.get('/trends', async (req, res) => {
  try {
    const currentData = await analyzeAllArticles();
    const oldData = getMockOldData();
    const trending = getTrendingWordFrequencies(oldData, currentData);
    res.json(trending);
  } catch (error) {
    console.error('Error calculating trends:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 7. Named entity extraction demo or parameter-driven extraction
app.get('/entities', async (req, res) => {
  try {
    const text = req.query.text || "Apple is expanding in India and competing with Google";
    const entities = extractEntities(text);
    res.json(entities);
  } catch (error) {
    console.error('Error extracting entities:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 8. Wipe database endpoint
app.delete('/clear', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE articles');
    console.log('🗑️ Database cleared manually via client call.');
    res.json({ message: 'Database wiped successfully.' });
  } catch (error) {
    console.error('Error truncating articles:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 9. Sentiment analytics & entity correlation aggregator endpoint
app.get('/sentiment-analytics', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT title, content, sentiment FROM articles');
    
    const summary = { positive: 0, negative: 0, neutral: 0 };
    const entityBreakdown = {};

    const entitiesToTrack = [
      "Apple", "Google", "Microsoft", "Tesla", "Amazon",
      "India", "USA", "China", "Germany", "Japan"
    ];

    // Initialize mapping metrics
    for (const ent of entitiesToTrack) {
      entityBreakdown[ent] = { positive: 0, negative: 0, neutral: 0, total: 0 };
    }

    for (const row of rows) {
      const sentiment = row.sentiment || 'neutral';
      if (summary[sentiment] !== undefined) {
        summary[sentiment]++;
      }
      
      const fullText = `${row.title}. ${row.content || ''}`;
      
      // Increment entity count when mentioned
      for (const ent of entitiesToTrack) {
        const regex = new RegExp(`\\b${ent}\\b`, 'i');
        if (regex.test(fullText)) {
          entityBreakdown[ent][sentiment]++;
          entityBreakdown[ent].total++;
        }
      }
    }

    res.json({
      summary,
      entities: entityBreakdown
    });
  } catch (error) {
    console.error('Error compiling sentiment metrics:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Initialize database tables and then launch server listener
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Node.js Event Intelligence Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to start server due to database initialization failure.');
  process.exit(1);
});
