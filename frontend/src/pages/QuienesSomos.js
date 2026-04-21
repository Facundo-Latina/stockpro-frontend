import React from 'react';
import '../styles/pages.css';

const team = [
  { nombre: 'Ana García', rol: 'CEO & Fundadora', desc: 'Más de 10 años en gestión de operaciones y logística.' },
  { nombre: 'Lucas Torres', rol: 'CTO', desc: 'Arquitecto de software especializado en sistemas empresariales.' },
  { nombre: 'Sofía Ramos', rol: 'Head of Product', desc: 'Diseñadora UX con foco en experiencias simples y efectivas.' },
  { nombre: 'Nicolás Paz', rol: 'Lead Developer', desc: 'Full stack developer apasionado por el código limpio.' },
];

const valores = [
  { icon: '🎯', title: 'Precisión', desc: 'Cada número importa. Construimos herramientas que eliminan el error humano en la gestión de inventario.' },
  { icon: '⚡', title: 'Velocidad', desc: 'Actualizaciones en tiempo real para que nunca pierdas el control de tu negocio.' },
  { icon: '🔒', title: 'Seguridad', desc: 'Tu información está protegida con los más altos estándares de seguridad.' },
  { icon: '💡', title: 'Simplicidad', desc: 'Tecnología compleja detrás de una interfaz que cualquiera puede usar.' },
];

export default function QuienesSomos() {
  return (
    <main className="container page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-tag">✦ Sobre nosotros</div>
        <h1 className="about-title">
          Simplificamos la gestión<br />
          de <span className="text-accent">inventario</span>
        </h1>
        <p className="about-desc">
          StockPro nació en 2020 con una misión clara: darle a cada negocio, sin importar su tamaño,
          las herramientas para tener un control total de su inventario de forma simple y eficiente.
        </p>
      </section>

      {/* Misión y Visión */}
      <section className="about-mission">
        <div className="card about-mission-card">
          <div className="about-mission-icon">🎯</div>
          <h2>Nuestra Misión</h2>
          <p>
            Brindar a cada comerciante una plataforma moderna, confiable y accesible para gestionar su inventario,
            reducir pérdidas y tomar decisiones basadas en datos reales.
          </p>
        </div>
        <div className="card about-mission-card">
          <div className="about-mission-icon">🔭</div>
          <h2>Nuestra Visión</h2>
          <p>
            Ser la plataforma de gestión de stock más usada en Latinoamérica, ayudando a miles de negocios
            a crecer de forma ordenada y eficiente.
          </p>
        </div>
      </section>

      {/* Valores */}
      <section className="about-values">
        <h2 className="section-title">Nuestros valores</h2>
        <div className="about-values-grid">
          {valores.map((v, i) => (
            <div key={i} className="card about-value-card">
              <div className="about-value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo */}
      <section className="about-team">
        <h2 className="section-title">El equipo detrás de StockPro</h2>
        <div className="about-team-grid">
          {team.map((m, i) => (
            <div key={i} className="card about-team-card">
              <div className="about-team-avatar">{m.nombre.charAt(0)}</div>
              <h3 className="about-team-name">{m.nombre}</h3>
              <span className="badge badge-info" style={{ marginBottom: 10 }}>{m.rol}</span>
              <p className="about-team-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="about-stack">
        <div className="card" style={{ padding: '32px 36px' }}>
          <h2 className="section-title" style={{ marginBottom: 20, textAlign: 'left' }}>Stack tecnológico</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'bcrypt', 'REST API', 'Vercel', 'Render'].map(t => (
              <span key={t} className="badge badge-info" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
