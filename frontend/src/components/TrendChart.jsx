import React, { useState } from 'react';

export default function TrendChart({ trendData = {} }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Sort and filter top 10 trends
  const entries = Object.entries(trendData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (entries.length === 0) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        border: '1px dashed var(--bg-elevated)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(255,255,255,0.01)'
      }}>
        No active trending keyphrases detected. Refresh the dashboard to sync data feeds.
      </div>
    );
  }

  const maxVal = Math.max(...entries.map(e => e[1]), 1);

  // Dimensions
  const width = 600;
  const height = 240;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const barGap = 16;
  const totalGaps = entries.length - 1;
  const barWidth = (chartWidth - (barGap * totalGaps)) / entries.length;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = paddingTop + chartHeight * (1 - ratio);
          const val = Math.round(maxVal * ratio);
          return (
            <g key={index}>
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                stroke="rgba(255,255,255,0.06)" 
                strokeWidth="1" 
              />
              <text 
                x={paddingLeft - 8} 
                y={y + 4} 
                fill="var(--text-secondary)" 
                fontSize="10" 
                textAnchor="end"
                fontFamily="var(--font-sans)"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {entries.map(([word, val], index) => {
          const x = paddingLeft + index * (barWidth + barGap);
          const barHeight = (val / maxVal) * chartHeight;
          const y = height - paddingBottom - barHeight;

          // Distinct Rank Colors (Gold, Silver, Bronze)
          let fill = 'var(--color-interactive)';
          let glow = 'rgba(59, 130, 246, 0.3)';
          
          if (index === 0) {
            fill = '#FFD700'; // Gold
            glow = 'rgba(255, 215, 0, 0.3)';
          } else if (index === 1) {
            fill = '#C0C0C0'; // Silver
            glow = 'rgba(192, 192, 192, 0.3)';
          } else if (index === 2) {
            fill = '#CD7F32'; // Bronze
            glow = 'rgba(205, 127, 50, 0.3)';
          }

          const isHovered = hoveredBar === index;

          return (
            <g 
              key={word}
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Highlight Border outline */}
              {isHovered && (
                <rect
                  x={x - 2}
                  y={y - 2}
                  width={barWidth + 4}
                  height={barHeight + 2}
                  rx="6"
                  fill="none"
                  stroke={fill}
                  strokeWidth="1.5"
                  style={{ opacity: 0.8 }}
                />
              )}
              
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill={fill}
                style={{
                  transition: 'all 0.25s ease',
                  filter: isHovered ? `drop-shadow(0 0 6px ${glow})` : 'none',
                  opacity: isHovered ? 1 : 0.8
                }}
              />
              
              {/* Word label slanted slightly */}
              <text
                x={x + barWidth / 2}
                y={height - paddingBottom + 16}
                fill={isHovered ? 'var(--text-primary)' : 'var(--text-secondary)'}
                fontSize="10"
                fontFamily="var(--font-sans)"
                fontWeight={isHovered ? '600' : '400'}
                textAnchor="middle"
                transform={`rotate(15, ${x + barWidth / 2}, ${height - paddingBottom + 16})`}
                style={{ textTransform: 'capitalize', transition: 'var(--transition-smooth)' }}
              >
                {word.length > 8 ? `${word.substring(0, 7)}…` : word}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Embedded Tooltip */}
      {hoveredBar !== null && (
        <div style={{
          position: 'absolute',
          top: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.4rem 0.8rem',
          fontSize: '0.75rem',
          boxShadow: 'var(--shadow-premium)',
          pointerEvents: 'none',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 10
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            "{entries[hoveredBar][0]}"
          </span>
          <span style={{ color: 'var(--color-positive)' }}>
            {entries[hoveredBar][1]} hits
          </span>
        </div>
      )}
    </div>
  );
}
