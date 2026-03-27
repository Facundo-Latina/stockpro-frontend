import React from 'react';

export default function QuienesSomos() {
  const valores = [
    { icon: '🎯', title: 'Precisión', desc: 'Cada número importa. Trabajamos para que tu inventario sea exacto.' },
    { icon: '⚡', title: 'Velocidad', desc: 'Actualizaciones en tiempo real para que nunca te quedes sin información.' },
    { icon: '🔒', title: 'Seguridad', desc: 'Tu información siempre protegida con autenticación segura.' },
    { icon: '💡', title: 'Simplicidad', desc: 'Diseñado para que cualquiera pueda usarlo sin complicaciones.' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 1 }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
          Sobre{' '}
          <span style={{ background: 'linear-gradient(135deg, #6ee7f7, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            StockPro
          </span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto', lineHeight: 1.8 }}>
          Somos un equipo apasionado por simplificar la gestión de inventario para negocios de todos los tamaños.
        </p>
      </div>

      {/* Mission */}
      <div className="glass" style={{ padding: '40px 48px', marginBottom: 40, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16, color: 'var(--accent)' }}>Nuestra Misión</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 640, margin: '0 auto' }}>
          Brindarle a cada comerciante una herramienta moderna, simple y confiable para tener control total de su inventario,
          reducir pérdidas y tomar mejores decisiones basadas en datos reales.
        </p>
      </div>

      {/* Values */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 24 }}>Nuestros valores</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 60 }}>
        {valores.map((v, i) => (
          <div key={i} className="glass" style={{ padding: 28 }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>{v.icon}</div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 8 }}>{v.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Tech */}
      <div className="glass" style={{ padding: '32px 40px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>Stack tecnológico</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['React.js', 'Node.js', 'Express', 'MongoDB', 'JWT Auth', 'REST API'].map(t => (
            <span key={t} className="badge badge-info" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
