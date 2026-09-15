import React, { useState } from 'react';
import { Search, Eye, X, Cpu, MapPin, Building } from 'lucide-react';
import { extractEntitiesFromText } from '../api';

export default function ArticleTable({ articles = [], onAddArticle }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [extractedEntities, setExtractedEntities] = useState(null);
  const [loadingEntities, setLoadingEntities] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Search logic filter
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewArticle = async (article) => {
    setSelectedArticle(article);
    setLoadingEntities(true);
    setExtractedEntities(null);
    try {
      // Concatenate title and content to perform entity recognition across all text
      const textToAnalyze = `${article.title}. ${article.content || ''}`;
      const data = await extractEntitiesFromText(textToAnalyze);
      setExtractedEntities(data);
    } catch (err) {
      console.error('Failed to run NER parsing:', err);
    } finally {
      setLoadingEntities(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddArticle({ title: newTitle, content: newContent });
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
  };

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📰 Saved Tech Articles
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
            ({filteredArticles.length} items)
          </span>
        </h2>
        
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '200px' }}>
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.25rem', fontSize: '0.85rem', height: '36px' }}
            />
            <Search 
              size={15} 
              style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} 
            />
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="secondary" style={{ fontSize: '0.85rem', height: '36px', padding: '0 1rem' }}>
            {showAddForm ? 'Cancel' : '＋ Add Article'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleFormSubmit} className="animate-fade-in" style={{
          padding: '1.25rem',
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-sm)',
          border: 'var(--border-premium)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Create New Article</h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Apple plans custom silicon design in India" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Body Content</label>
            <textarea 
              rows={3} 
              placeholder="Type article body for word frequency extraction..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" onClick={() => setShowAddForm(false)} className="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Cancel</button>
            <button type="submit" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Save Article</button>
          </div>
        </form>
      )}

      <div className="table-container">
        {filteredArticles.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No articles found. Try importing news or add custom ones.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>ID</th>
                <th style={{ width: '180px' }}>Title</th>
                <th>Content Preview</th>
                <th style={{ width: '90px' }}>Date</th>
                <th style={{ width: '90px', textAlign: 'center' }}>Sentiment</th>
                <th style={{ width: '70px', textAlign: 'center' }}>Analyze</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map(article => (
                <tr key={article.id}>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>#{article.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{article.title}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {article.content ? (article.content.length > 120 ? `${article.content.substring(0, 120)}...` : article.content) : <em>No text content</em>}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {article.created_at ? new Date(article.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    {article.sentiment === 'positive' && <span className="badge success" style={{ textTransform: 'capitalize' }}>Positive</span>}
                    {article.sentiment === 'negative' && <span className="badge danger" style={{ textTransform: 'capitalize' }}>Negative</span>}
                    {(!article.sentiment || article.sentiment === 'neutral') && <span className="badge gray" style={{ textTransform: 'capitalize' }}>Neutral</span>}
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <button 
                      onClick={() => handleViewArticle(article)} 
                      className="secondary" 
                      style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', display: 'inline-flex' }}
                      title="Scan text with AI"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Analysis overlay modal */}
      {selectedArticle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(5, 7, 12, 0.85)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '100%',
            maxWidth: '600px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedArticle(null)}
              className="secondary"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.35rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={15} />
            </button>

            <div>
              <span className="badge primary" style={{ marginBottom: '0.4rem' }}>Stored Article #{selectedArticle.id}</span>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {selectedArticle.title}
              </h3>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-primary)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'var(--border-premium)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              maxHeight: '160px',
              overflowY: 'auto'
            }}>
              {selectedArticle.content || <em>No body content provided.</em>}
            </div>

            {/* Entity extraction container */}
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '1.2rem'
            }}>
              <h4 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-ai)' }}>
                <Cpu size={15} /> AI Entities Spotted (NER)
              </h4>

              {loadingEntities ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  <div className="spinner" style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderTopColor: 'var(--color-ai)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Scanning article text using AI to extract companies and locations...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {/* Companies extracted */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '80px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Building size={13} /> Companies:
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {extractedEntities?.companies.length > 0 ? (
                        extractedEntities.companies.map(c => (
                          <span key={c} className="badge purple">{c}</span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No companies detected</span>
                      )}
                    </div>
                  </div>

                  {/* Locations extracted */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '80px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={13} /> Locations:
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {extractedEntities?.locations.length > 0 ? (
                        extractedEntities.locations.map(l => (
                          <span key={l} className="badge success">{l}</span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No locations detected</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
              <button onClick={() => setSelectedArticle(null)} style={{ padding: '0.4rem 1.25rem', fontSize: '0.85rem' }}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
