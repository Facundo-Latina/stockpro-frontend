import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const features = [
    { icon: '📦', title: 'Control de Inventario', desc: 'Gestioná el stock de todos tus productos en tiempo real.' },
    { icon: '🏷️', title: 'Categorías', desc: 'Organizá tus productos por categorías para encontrarlos fácil.' },
    { icon: '⚠️', title: 'Alertas de Stock', desc: 'Recibí alertas cuando un producto esté por agotarse.' },
    { icon: '👥', title: 'Gestión de Usuarios', desc: 'Administrá el acceso de tu equipo al sistema.' },
  ];

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
          background: 'rgba(110,231,247,0.1)', border: '1px solid rgba(110,231,247,0.2)',
          borderRadius: 999, fontSize: '0.8rem', color: 'var(--accent)',
          fontWeight: 600, letterSpacing: '0.05em', marginBottom: 28,
        }}>
          ✦ SISTEMA DE GESTIÓN DE STOCK
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24,
        }}>
          Tu inventario,{' '}
          <span style={{ background: 'linear-gradient(135deg, #6ee7f7, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            bajo control
          </span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7 }}>
          StockPro te permite gestionar el stock de tu negocio de forma simple, rápida y eficiente.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/productos" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              Ver Productos →
            </Link>
          ) : (
            <>
              <Link to="/registro" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                Empezar gratis →
              </Link>
              <Link to="/login" className="btn btn-glass" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { value: '100%', label: 'Control en tiempo real' },
            { value: '∞', label: 'Productos soportados' },
            { value: '24/7', label: 'Disponibilidad' },
            { value: '0$', label: 'Costo inicial' },
          ].map((s, i) => (
            <div key={i} className="glass stat-card" style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ color: i % 2 === 0 ? 'var(--accent)' : 'var(--accent2)' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 32, textAlign: 'center' }}>
          Todo lo que necesitás
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="glass" style={{ padding: 28 }}>
              <div style={{ fontSize: '2rem', marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
