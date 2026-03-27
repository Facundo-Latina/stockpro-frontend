import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', zIndex: 1,
    }}>
      <div className="glass" style={{ padding: '60px 48px', textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          fontSize: '6rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1,
          background: 'linear-gradient(135deg, #6ee7f7, #a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 16,
        }}>404</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>Página no encontrada</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.7 }}>
          La página que estás buscando no existe o fue movida.
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: '12px 28px' }}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
