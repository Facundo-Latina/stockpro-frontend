import React from 'react';

// ======================== SPINNER ========================
export const Spinner = () => (
  <div className="spinner-wrap">
    <div className="spinner" />
  </div>
);

// ======================== EMPTY STATE ========================
export const EmptyState = ({ icon = '📦', title, description }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3>{title}</h3>
    {description && <p>{description}</p>}
  </div>
);

// ======================== BADGE ========================
export const Badge = ({ variant = 'info', children }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

// ======================== AVATAR ========================
export const Avatar = ({ nombre, size = 34 }) => (
  <div
    className="avatar"
    style={{ width: size, height: size, fontSize: size * 0.35 }}
  >
    {nombre?.charAt(0).toUpperCase()}
  </div>
);

// ======================== STAT CARD ========================
export const StatCard = ({ value, label, color = 'var(--accent)' }) => (
  <div className="card stat-card">
    <div className="stat-value" style={{ color }}>{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

// ======================== PAGE HEADER ========================
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="page-header">
    <div>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ======================== STOCK BADGE ========================
export const StockBadge = ({ stock, stockMinimo }) => {
  if (stock === 0) return <Badge variant="danger">Sin stock</Badge>;
  if (stock <= stockMinimo) return <Badge variant="warning">Stock bajo</Badge>;
  return <Badge variant="success">En stock</Badge>;
};

// ======================== STOCK BAR ========================
export const StockBar = ({ stock, stockMinimo }) => {
  const max = Math.max(stock, stockMinimo * 3, 10);
  const pct = Math.min((stock / max) * 100, 100);
  const color = stock === 0 ? 'var(--red)' : stock <= stockMinimo ? 'var(--yellow)' : 'var(--green)';
  return (
    <div className="stock-bar-wrap">
      <div className="stock-bar">
        <div className="stock-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span style={{ fontSize: '0.78rem', color, fontWeight: 700, minWidth: 28 }}>{stock}</span>
    </div>
  );
};

// ======================== MODAL ========================
export const Modal = ({ title, subtitle, onClose, children, maxWidth = 520 }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" style={{ maxWidth }} onClick={e => e.stopPropagation()}>
      <h2 className="modal-title">{title}</h2>
      {subtitle && <p className="modal-subtitle">{subtitle}</p>}
      {children}
    </div>
  </div>
);

// ======================== CONFIRM MODAL ========================
export const ConfirmModal = ({ title, message, onConfirm, onClose, variant = 'danger' }) => (
  <Modal title={title} onClose={onClose} maxWidth={420}>
    <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>{message}</p>
    <div className="modal-actions">
      <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
      <button className={`btn btn-${variant}`} onClick={onConfirm}>Confirmar</button>
    </div>
  </Modal>
);

// ======================== FORM GROUP ========================
export const FormGroup = ({ label, error, children }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    {children}
    {error && <span className="form-error">{error}</span>}
  </div>
);
