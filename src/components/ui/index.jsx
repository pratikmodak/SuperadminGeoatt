// superadmin-web/src/components/ui/index.jsx
import React from 'react';

// ── MonoText ───────────────────────────────────────────────
export const Mono = ({ children, size = 12, color, className = '', style = {} }) => (
  <span
    className={`mono ${className}`}
    style={{ fontSize: size, color, ...style }}
  >
    {children}
  </span>
);

// ── Badge ─────────────────────────────────────────────────
export const Badge = ({ label, variant = 'default', dot = true }) => (
  <span className={`badge badge-${variant}`}>
    {dot && <span className="badge-dot" />}
    {label}
  </span>
);

// ── Avatar ────────────────────────────────────────────────
export const Avatar = ({ name = '', size = 'md', color = 'teal' }) => {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className={`avatar avatar-${size} avatar-${color}`}>
      {initials || '?'}
    </div>
  );
};

// ── Button ─────────────────────────────────────────────────
export const Button = ({ children, variant = 'primary', size = '', onClick, disabled, loading, className = '' }) => (
  <button
    className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`}
    onClick={onClick}
    disabled={disabled || loading}
  >
    {loading ? '...' : children}
  </button>
);

// ── StatCard ───────────────────────────────────────────────
export const StatCard = ({ label, value, change, changeType = 'neu', accent = 'teal' }) => (
  <div className={`stat-card ${accent}`}>
    <div className="stat-label">{label}</div>
    <div className={`stat-value ${accent === 'teal' ? '' : accent}`}>{value}</div>
    {change && <div className={`stat-change ${changeType}`}>{change}</div>}
  </div>
);

// ── Card ───────────────────────────────────────────────────
export const Card = ({ children, title, action, className = '', bodyClass = '' }) => (
  <div className={`card ${className}`}>
    {title && (
      <div className="card-header">
        <span className="card-title">{title}</span>
        {action}
      </div>
    )}
    <div className={`card-body ${bodyClass}`}>{children}</div>
  </div>
);

// ── ProgressBar ────────────────────────────────────────────
export const ProgressBar = ({ value = 0, max = 100, height = 4 }) => {
  const pct   = Math.min(100, (value / max) * 100);
  const cls   = pct > 90 ? 'danger' : pct > 70 ? 'warn' : '';
  return (
    <div className="prog" style={{ height }}>
      <div className={`prog-fill ${cls}`} style={{ width: `${pct}%` }} />
    </div>
  );
};

// ── HealthPill ─────────────────────────────────────────────
export const HealthPill = ({ label, value, status = 'ok' }) => {
  const colors = { ok: '#00D4AA', warn: '#FFA500', error: '#FF4757' };
  return (
    <div className="health-pill">
      <div className="health-dot" style={{ background: colors[status] }} />
      <span style={{ flex: 1, fontSize: 12 }}>{label}</span>
      <Mono size={11} color={colors[status]}>{value}</Mono>
    </div>
  );
};

// ── Input ──────────────────────────────────────────────────
export const Input = ({ label, type = 'text', placeholder, value, onChange, style }) => (
  <div className="form-row" style={style}>
    {label && <label className="input-label">{label}</label>}
    <input className="input" type={type} placeholder={placeholder} value={value} onChange={onChange} />
  </div>
);

// ── Select ─────────────────────────────────────────────────
export const Select = ({ label, options = [], value, onChange, style }) => (
  <div className="form-row" style={style}>
    {label && <label className="input-label">{label}</label>}
    <select value={value} onChange={onChange} style={{ backgroundImage: 'none' }}>
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  </div>
);

// ── PageHeader ─────────────────────────────────────────────
export const PageHeader = ({ breadcrumb, title, actions }) => (
  <div className="page-header">
    {breadcrumb && <div className="page-breadcrumb">{breadcrumb}</div>}
    <div className="flex items-center">
      <h1 className="page-title" style={{ flex: 1 }}>{title}</h1>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  </div>
);

// ── SectionLabel ───────────────────────────────────────────
export const SectionLabel = ({ children }) => (
  <div className="mono muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
    {children}
  </div>
);

// ── Divider ────────────────────────────────────────────────
export const Divider = ({ style }) => (
  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0', ...style }} />
);
