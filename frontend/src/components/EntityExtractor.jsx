import React, { useState } from 'react';
import { Cpu, MapPin, Building, Play } from 'lucide-react';
import { extractEntitiesFromText } from '../api';

export default function EntityExtractor() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const data = await extractEntitiesFromText(text);
      setResults(data);
    } catch (err) {
      setError('Connection to NLP API failed. Check if Node.js server is online.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'fit-content' }}>
      <div>
        <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-ai)' }}>
          <Cpu size={18} /> AI Tagger Sandbox
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Type or paste English text to see the AI scanner extract key company and location names.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <textarea
          rows={4}
          placeholder="e.g., Apple is partnering with manufacturers in India to challenge Tesla and Google in automated tech products..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ fontSize: '0.85rem', resize: 'vertical' }}
        />
        <button 
          onClick={handleExtract} 
          disabled={loading || !text.trim()} 
          className="ai-btn"
          style={{ width: '100%', justifyContent: 'center', opacity: (!text.trim() || loading) ? 0.6 : 1, fontSize: '0.85rem' }}
        >
          {loading ? 'Scanning Text...' : <><Play size={13} /> Scan Text with AI</>}
        </button>
      </div>

      {error && (
        <div style={{ color: 'var(--color-negative)', fontSize: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      {results && (
        <div style={{
          backgroundColor: 'var(--bg-elevated)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          border: 'var(--border-premium)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600 }}>AI Scanner Spotted:</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <Building size={14} style={{ color: 'var(--color-ai)', marginTop: '0.15rem' }} />
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.05em' }}>COMPANIES</p>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                  {results.companies.length > 0 ? (
                    results.companies.map(c => <span key={c} className="badge purple" style={{ fontSize: '0.7rem' }}>{c}</span>)
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>None detected</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <MapPin size={14} style={{ color: 'var(--color-positive)', marginTop: '0.15rem' }} />
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.05em' }}>LOCATIONS</p>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                  {results.locations.length > 0 ? (
                    results.locations.map(l => <span key={l} className="badge success" style={{ fontSize: '0.7rem' }}>{l}</span>)
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>None detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
