// superadmin-web/src/components/charts/index.jsx
/**
 * Chart components using pure SVG — no chart library needed.
 * Keeps the web panel fast and dependency-free.
 */
import React from 'react';

// ── Shared helpers ────────────────────────────────────────
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ── AttendanceTrendChart — 7-day line chart ───────────────
export const AttendanceTrendChart = ({ data = [], height = 120 }) => {
  if (!data.length) return null;

  const W     = 580;
  const H     = height;
  const PAD   = { top: 12, right: 20, bottom: 28, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top  - PAD.bottom;

  const maxVal = Math.max(...data.map(d => d.present), 1);
  const step   = chartW / Math.max(data.length - 1, 1);

  // Points
  const pts = data.map((d, i) => ({
    x: PAD.left + i * step,
    y: PAD.top  + chartH - (d.present / maxVal) * chartH,
    ...d,
  }));

  const linePath   = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath   = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${(PAD.top + chartH).toFixed(1)} L ${PAD.left} ${(PAD.top + chartH).toFixed(1)} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#00D4AA" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#00D4AA" stopOpacity="0.01"/>
        </linearGradient>
      </defs>

      {/* Horizontal grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const y = PAD.top + chartH - pct * chartH;
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
              stroke="#DDE5F0" strokeWidth="0.5" strokeDasharray="4,3"/>
            <text x={PAD.left - 6} y={y + 4} textAnchor="end"
              fontSize="9" fontFamily="DM Mono, monospace" fill="#8A9BBB">
              {Math.round(maxVal * pct)}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)"/>

      {/* Line */}
      <path d={linePath} fill="none" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Dots + labels */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#00D4AA" stroke="#fff" strokeWidth="1.5"/>
          <text x={p.x} y={H - PAD.bottom + 14} textAnchor="middle"
            fontSize="9" fontFamily="DM Mono, monospace" fill="#8A9BBB">
            {p.label || `D${i + 1}`}
          </text>
        </g>
      ))}
    </svg>
  );
};

// ── DonutChart — company / status breakdown ───────────────
export const DonutChart = ({ segments = [], size = 100, thickness = 18 }) => {
  const R       = (size / 2) - thickness / 2;
  const cx      = size / 2;
  const cy      = size / 2;
  const circumf = 2 * Math.PI * R;
  const total   = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  let offset = 0;
  const arcs = segments.map(seg => {
    const pct  = seg.value / total;
    const dash = pct * circumf;
    const arc  = { ...seg, dashArray: `${dash.toFixed(2)} ${(circumf - dash).toFixed(2)}`, dashOffset: -offset };
    offset += dash;
    return arc;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((arc, i) => (
        <circle key={i}
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke={arc.color}
          strokeWidth={thickness}
          strokeDasharray={arc.dashArray}
          strokeDashoffset={arc.dashOffset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      ))}
      {/* Centre text */}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="16" fontWeight="700"
        fontFamily="DM Mono, monospace" fill="#0A1628">
        {total}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9"
        fontFamily="DM Mono, monospace" fill="#8A9BBB">
        total
      </text>
    </svg>
  );
};

// ── BarChart — horizontal bar for leave types ─────────────
export const HorizontalBarChart = ({ data = [], maxWidth = 300 }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#8A9BBB', minWidth: 80 }}>
            {d.label}
          </span>
          <div style={{ flex: 1, height: 6, background: '#E8EEF7', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(d.value / maxVal) * 100}%`,
              background: d.color || '#00D4AA',
              borderRadius: 3,
              transition: 'width .4s',
            }} />
          </div>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#0A1628', minWidth: 24 }}>
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── SparkLine — tiny inline trend ─────────────────────────
export const SparkLine = ({ values = [], color = '#00D4AA', height = 32, width = 80 }) => {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step  = width / (values.length - 1);

  const pts = values.map((v, i) => ({
    x: i * step,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }));

  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};
