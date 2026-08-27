import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, AlertCircle, Database } from 'lucide-react';
import { fetchArticles, fetchTrends, ingestArticles, addArticle, clearDatabase, fetchSentimentAnalytics } from './api';
import Metrics from './components/Metrics';
import TrendChart from './components/TrendChart';
import ArticleTable from './components/ArticleTable';
import EntityExtractor from './components/EntityExtractor';

export default function App() {
  const [articles, setArticles] = useState([]);
  const [trends, setTrends] = useState({});
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [error, setError] = useState('');

  const [sentimentData, setSentimentData] = useState(null);

  // Fetch data function
  const loadDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const [fetchedArticles, fetchedTrends, fetchedSentiment] = await Promise.all([
        fetchArticles(),
        fetchTrends(),
        fetchSentimentAnalytics()
      ]);
      setArticles(fetchedArticles);
      setTrends(fetchedTrends);
      setSentimentData(fetchedSentiment);
    } catch (err) {
      setError('Connection to backend server failed. Make sure the Node.js Express backend is running on port 8080.');
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Trigger JSONPlaceholder ingestion pipeline
  const handleIngestFeed = async () => {
    setIngesting(true);
    setError('');
    try {
      await ingestArticles();
      // Reload dashboard data
      await loadDashboardData(true);
    } catch (err) {
      setError('Ingestion pipeline failed. Check backend database connectivity.');
      console.error(err);
    } finally {
      setIngesting(false);
    }
  };

  // Add a custom article manual override
  const handleAddArticle = async (newArticle) => {
    try {
      await addArticle(newArticle);
      // Reload dashboard data
      await loadDashboardData(true);
    } catch (err) {
      setError('Failed to insert custom article.');
      console.error(err);
    }
  };

  // Clear all database entries
  const handleClearDatabase = async () => {
    if (window.confirm('Are you sure you want to delete all saved tech articles from your database?')) {
      try {
        await clearDatabase();
        setArticles([]);
        setTrends({});
        setSentimentData(null);
      } catch (err) {
        setError('Failed to clear database articles.');
        console.error(err);
      }
    }
  };

  // Identify the top trending word for metrics
  const topTrendingWord = Object.entries(trends).length > 0
    ? Object.entries(trends).sort((a, b) => b[1] - a[1])[0][0]
    : '';

  return (
    <div className="dashboard-container">
      {/* 1. Top Navbar / Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 className="main-title">
            Event Intelligence Platform
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Import real-time technology articles, scan them with AI, and track trending tech keywords.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handleIngestFeed} 
            disabled={ingesting || loading}
            className="ai-btn"
          >
            <Play size={16} className={ingesting ? 'animate-spin' : ''} />
            {ingesting ? 'Importing Articles...' : '⚡ Import Tech Articles'}
          </button>
          
          <button 
            onClick={() => loadDashboardData()} 
            disabled={loading || ingesting}
            className="secondary"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Sync Data
          </button>

          <button 
            onClick={handleClearDatabase} 
            disabled={loading || ingesting}
            className="secondary"
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--color-negative)' }}
          >
            🗑️ Clear Data
          </button>
        </div>
      </header>

      {/* 2. Error Message Alert */}
      {error && (
        <div className="animate-fade-in" style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          color: 'var(--color-negative)',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <span style={{ fontWeight: 700 }}>System Error:</span> {error}
          </div>
        </div>
      )}

      {/* 3. Metrics Cards */}
      <Metrics 
        articleCount={articles.length} 
        trendCount={Object.keys(trends).length} 
        topWord={topTrendingWord}
      />

      {/* 4. Core Grid Dashboard */}
      <div className="grid-main">
        {/* Left Column: Data viz and table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Trend Analysis viz card */}
          <div className="glass-card animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              📈 Hot Topic Spikes (Real-time)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              This chart displays the most frequent keywords extracted from tech articles. Gold, Silver, and Bronze indicate the top 3 spots.
            </p>
            <TrendChart trendData={trends} />
          </div>

          {/* Sentiment Index breakdown card */}
          {sentimentData && sentimentData.entities && (
            <div className="glass-card animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📊 Company & Location Sentiment Index
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                Tracks whether articles mentioning specific brands or locations carry positive, neutral, or negative tones.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {Object.entries(sentimentData.entities)
                  .filter(([name, data]) => data.total > 0)
                  .map(([name, data]) => {
                    const posPct = (data.positive / data.total) * 100;
                    const negPct = (data.negative / data.total) * 100;
                    const neuPct = (data.neutral / data.total) * 100;

                    return (
                      <div key={name} style={{ display: 'grid', gridTemplateColumns: '120px 60px 1fr', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{name}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{data.total} hits</span>
                        
                        {/* Proportional Stacked Progress Bar */}
                        <div style={{
                          height: '10px',
                          display: 'flex',
                          borderRadius: '5px',
                          overflow: 'hidden',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                          {data.positive > 0 && (
                            <div style={{
                              width: `${posPct}%`,
                              backgroundColor: 'var(--color-positive)',
                              transition: 'var(--transition-smooth)'
                            }} title={`${data.positive} Positive`} />
                          )}
                          {data.neutral > 0 && (
                            <div style={{
                              width: `${neuPct}%`,
                              backgroundColor: 'var(--color-neutral)',
                              transition: 'var(--transition-smooth)'
                            }} title={`${data.neutral} Neutral`} />
                          )}
                          {data.negative > 0 && (
                            <div style={{
                              width: `${negPct}%`,
                              backgroundColor: 'var(--color-negative)',
                              transition: 'var(--transition-smooth)'
                            }} title={`${data.negative} Negative`} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                
                {Object.entries(sentimentData.entities).filter(([name, data]) => data.total > 0).length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem', fontStyle: 'italic', fontSize: '0.85rem' }}>
                    No tracked company or country entities found in the saved articles yet. Import articles to run analysis.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Source Article Database table card */}
          <ArticleTable 
            articles={articles} 
            onAddArticle={handleAddArticle} 
          />
        </div>

        {/* Right Column: NLP Sandbox */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <EntityExtractor />
          
          <div className="glass-card animate-fade-in" style={{
            backgroundColor: 'rgba(22, 31, 48, 0.5)',
            borderStyle: 'dashed'
          }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              💡 Developer Portfolio Notes
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              A full-stack showcase exhibiting automated data ingestion, comparative trend analytics, and automated text scanning.
            </p>
            <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              <li><strong>ETL Pipeline:</strong> Pulls developer articles from the live Dev.to feed and saves them directly to MySQL.</li>
              <li><strong>AI Scanner:</strong> Processes text to identify references to custom technology companies and global locations.</li>
              <li><strong>Database:</strong> Leverages standard MySQL pooling to retrieve and manage article records.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Spinner animation injected */}
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
