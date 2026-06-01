import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Hero */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '72px 24px 56px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 14px',
          background: 'rgba(94,234,212,0.08)',
          border: '1px solid rgba(94,234,212,0.18)',
          borderRadius: 999,
          fontSize: '0.72rem', fontWeight: 600,
          color: 'var(--a)', letterSpacing: '0.07em',
          textTransform: 'uppercase', marginBottom: 26,
        }}>
          Sistema de gestión de inventario
        </div>

        <h1 style={{
          fontSize: 'clamp(2.6rem, 6vw, 4.8rem)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1.08,
          marginBottom: 20,
        }}>
          Tu inventario,
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #5eead4 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            bajo control
          </span>
        </h1>

        <p style={{
          fontSize: '1.05rem', color: 'var(--t2)',
          maxWidth: 500, margin: '0 auto 38px', lineHeight: 1.75,
        }}>
          StockPro centraliza tu stock, alertas y métricas en un solo lugar.
          Simple, rápido y confiable.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/productos" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem', borderRadius: 999 }}>
              Ver productos
            </Link>
          ) : (
            <>
              <Link to="/registro" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem', borderRadius: 999 }}>
                Empezar gratis
              </Link>
              <Link to="/login" className="btn btn-glass" style={{ padding: '12px 28px', fontSize: '0.9rem', borderRadius: 999 }}>
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats row */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 52px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: 12 }}>
          {[
            { n: '100%', l: 'Tiempo real' },
            { n: '∞',    l: 'Productos' },
            { n: '24/7', l: 'Disponibilidad' },
            { n: '0 $',  l: 'Costo inicial' },
          ].map((s, i) => (
            <div key={i} className="card stat" style={{ textAlign: 'center' }}>
              <div className="stat-n" style={{ color: i % 2 === 0 ? 'var(--a)' : 'var(--a2)' }}>{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 24 }}>
          Funcionalidades
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {[
            { title: 'Control de inventario',  desc: 'Gestioná el stock de tus productos en tiempo real con historial de movimientos.' },
            { title: 'Alertas automáticas',     desc: 'Identificá de inmediato los productos que están por debajo del mínimo establecido.' },
            { title: 'Categorías',              desc: 'Organizá tu catálogo por categorías para filtrar y encontrar productos rápidamente.' },
            { title: 'Dashboard de métricas',  desc: 'Visualizá el estado general de tu inventario con gráficos y estadísticas clave.' },
            { title: 'Gestión de usuarios',     desc: 'Administrá los accesos de tu equipo con roles diferenciados.' },
            { title: 'Exportación CSV',         desc: 'Descargá tu inventario en formato CSV para análisis externos en cualquier momento.' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: '22px 24px' }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i % 2 === 0 ? 'var(--a)' : 'var(--a2)',
                marginBottom: 14,
              }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 7 }}>{f.title}</h3>
              <p style={{ color: 'var(--t2)', fontSize: '0.83rem', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
