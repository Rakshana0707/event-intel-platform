import axios from 'axios';
import pool from '../config/db.js';
import { analyzeSentiment } from './sentimentService.js';

/**
 * Fetches news posts from placeholder API and persists them to the MySQL database.
 * Matches Java's NewsService.
 *
 * @returns {Promise<any[]>} The list of saved article objects.
 */
export async function fetchNewsAndSave() {
  const url = 'https://dev.to/api/articles?per_page=10';
  
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const posts = response.data;
    const savedArticles = [];

    if (posts && Array.isArray(posts)) {
      // Ingest the first 10 articles in real English
      for (let i = 0; i < 10 && i < posts.length; i++) {
        const post = posts[i];
        
        // Skip duplicate titles if they already exist to keep database clean
        const [existing] = await pool.query('SELECT id FROM articles WHERE title = ?', [post.title]);
        if (existing && existing.length > 0) {
          continue; 
        }

        const sentiment = analyzeSentiment(post.title, post.description);

        const [result] = await pool.query(
          'INSERT INTO articles (title, content, sentiment) VALUES (?, ?, ?)',
          [post.title, post.description || '', sentiment]
        );
        
        savedArticles.push({
          id: result.insertId,
          title: post.title,
          content: post.description || '',
          sentiment: sentiment
        });
      }
    }
    
    return savedArticles;
  } catch (error) {
    console.error('Error fetching or saving news articles:', error.message);
    throw error;
  }
}
