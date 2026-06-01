import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 1 }}>
      <div className="card" style={{ padding: '52px 44px', textAlign: 'center', maxWidth: 420 }}>
        <div style={{
          fontSize: '5rem', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 1,
          background: 'linear-gradient(135deg, #5eead4, #818cf8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 14,
        }}>404</div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Página no encontrada</h2>
        <p style={{ color: 'var(--t3)', marginBottom: 26, fontSize: '0.85rem', lineHeight: 1.65 }}>
          La página que buscás no existe o fue movida.
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 999 }}>Volver al inicio</Link>
      </div>
    </div>
  );
}
