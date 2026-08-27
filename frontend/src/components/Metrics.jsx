import React from 'react';
import { Database, TrendingUp, Cpu, Award } from 'lucide-react';

export default function Metrics({ articleCount, trendCount, topWord }) {
  return (
    <div className="grid-cols-4 animate-fade-in">
      {/* Metric 1 */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          padding: '0.8rem',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-interactive)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Database size={24} />
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase' }}>Articles Saved</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '0.2rem' }}>{articleCount}</p>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          padding: '0.8rem',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-positive)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TrendingUp size={24} />
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase' }}>Active Spikes</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '0.2rem' }}>{trendCount}</p>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          padding: '0.8rem',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-ai)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Award size={24} />
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase' }}>Hot Topic</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '0.2rem', color: '#FFD700', textTransform: 'capitalize' }}>
            {topWord || 'None'}
          </p>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          padding: '0.8rem',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-negative)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Cpu size={24} />
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase' }}>AI Scanner</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.4rem', color: 'var(--color-positive)' }}>
            🟢 Operational
          </p>
        </div>
      </div>
    </div>
  );
}
