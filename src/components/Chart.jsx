import React from 'react';

// Simple bar chart for insights
export function Chart({ data, labels, title = 'Graph', height = 180 }) {
  const max = Math.max(...data, 1);
  return (
    <div className="card chart-card">
      <h2>{title}</h2>
      <svg width="100%" height={height} viewBox={`0 0 ${data.length * 40} ${height}`} style={{ background: '#f8fafc', borderRadius: 8 }}>
        {data.map((v, i) => (
          <g key={i}>
            <rect
              x={i * 40 + 10}
              y={height - (v / max) * (height - 40) - 20}
              width={20}
              height={(v / max) * (height - 40)}
              fill="#38bdf8"
              rx={4}
            />
            <text
              x={i * 40 + 20}
              y={height - 8}
              textAnchor="middle"
              fontSize={12}
              fill="#334155"
            >{labels[i]}</text>
            <text
              x={i * 40 + 20}
              y={height - (v / max) * (height - 40) - 28}
              textAnchor="middle"
              fontSize={11}
              fill="#0f172a"
            >{v}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
