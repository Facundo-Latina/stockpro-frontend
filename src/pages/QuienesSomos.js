import React from 'react';

export default function QuienesSomos() {
  return (
    <div className="page" style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 52, textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.035em', marginBottom: 14 }}>
          Sobre{' '}
          <span style={{ background: 'linear-gradient(135deg, #5eead4, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            StockPro
          </span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--t2)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
          Simplificamos la gestión de inventario para negocios de todos los tamaños.
        </p>
      </div>

      <div className="card" style={{ padding: '32px 40px', marginBottom: 28, textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--t2)', lineHeight: 1.85, maxWidth: 580, margin: '0 auto' }}>
          Nuestra misión es brindarle a cada comerciante una herramienta moderna, simple y confiable
          para tener control total de su inventario, reducir pérdidas y tomar mejores decisiones
          basadas en datos reales.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginBottom: 36 }}>
        {[
          { t: 'Precisión',   d: 'Cada número importa. Trabajamos para que tu inventario sea exacto.' },
          { t: 'Velocidad',   d: 'Actualizaciones en tiempo real para que nunca pierdas información.' },
          { t: 'Seguridad',   d: 'Tu información protegida con autenticación JWT.' },
          { t: 'Simplicidad', d: 'Diseñado para que cualquiera pueda usarlo sin fricción.' },
        ].map((v, i) => (
          <div key={i} className="card" style={{ padding: '20px 22px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: i % 2 === 0 ? 'var(--a)' : 'var(--a2)', marginBottom: 12 }} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>{v.t}</h3>
            <p style={{ color: 'var(--t3)', fontSize: '0.82rem', lineHeight: 1.6 }}>{v.d}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '22px 28px' }}>
        <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--t3)', marginBottom: 12, fontWeight: 600 }}>
          Stack tecnológico
        </p>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {['React 18', 'Node.js', 'Express', 'MongoDB', 'JWT', 'REST API', 'Recharts'].map(t => (
            <span key={t} className="badge badge-info" style={{ padding: '4px 11px', fontSize: '0.78rem' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
