import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/UI';
import '../styles/home.css';

const features = [
  {
    icon: '📦',
    color: 'rgba(99,210,255,0.12)',
    title: 'Control de Inventario',
    desc: 'Gestioná el stock de todos tus productos en tiempo real con actualizaciones instantáneas.',
  },
  {
    icon: '🏷️',
    color: 'rgba(183,148,244,0.12)',
    title: 'Categorías Flexibles',
    desc: 'Organizá tu catálogo con categorías personalizadas para encontrar cualquier producto al instante.',
  },
  {
    icon: '⚠️',
    color: 'rgba(251,191,36,0.12)',
    title: 'Alertas de Stock Bajo',
    desc: 'El sistema detecta automáticamente cuando un producto está por debajo del mínimo configurado.',
  },
  {
    icon: '👥',
    color: 'rgba(74,222,128,0.12)',
    title: 'Gestión de Equipo',
    desc: 'Controlá quién tiene acceso y qué puede hacer cada miembro de tu equipo.',
  },
  {
    icon: '📊',
    color: 'rgba(99,210,255,0.12)',
    title: 'Panel Administrativo',
    desc: 'Visualizá estadísticas clave de tu inventario desde un dashboard centralizado.',
  },
  {
    icon: '🔒',
    color: 'rgba(248,113,113,0.12)',
    title: 'Seguridad Garantizada',
    desc: 'Autenticación JWT con encriptación de contraseñas. Tus datos siempre protegidos.',
  },
];

const testimonials = [
  {
    text: '"StockPro transformó la forma en que manejamos nuestro depósito. Redujimos los errores de stock en un 90% en el primer mes."',
    name: 'Carlos Méndez',
    role: 'Gerente de Operaciones — Distribuidora Norte',
  },
  {
    text: '"La interfaz es tan intuitiva que todo el equipo la aprendió en un día. La mejor inversión que hicimos este año."',
    name: 'Laura Fernández',
    role: 'Dueña — Ferretería La Central',
  },
  {
    text: '"Finalmente un sistema que se adapta a nosotros y no al revés. Las alertas automáticas nos salvaron varias veces."',
    name: 'Martín Sosa',
    role: 'Director — Importadora Sur S.A.',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <main>
      {/* Hero */}
      <section className="home-hero container">
        <div className="home-tag">✦ Sistema de Gestión de Stock</div>
        <h1 className="home-title">
          Tu inventario,<br />
          <span className="home-title-gradient">siempre bajo control</span>
        </h1>
        <p className="home-desc">
          StockPro es la plataforma que necesita tu negocio para gestionar el stock de forma inteligente, eficiente y sin errores.
        </p>
        <div className="home-cta">
          {user ? (
            <Link to="/productos" className="btn btn-primary btn-lg">
              Ver Inventario →
            </Link>
          ) : (
            <>
              <Link to="/registro" className="btn btn-primary btn-lg">
                Empezar gratis →
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="home-stats container">
        <div className="home-stats-grid">
          <StatCard value="+500" label="Empresas activas" color="var(--accent)" />
          <StatCard value="99.9%" label="Disponibilidad" color="var(--green)" />
          <StatCard value="24/7" label="Soporte técnico" color="var(--accent2)" />
          <StatCard value="0$" label="Para siempre gratis" color="var(--yellow)" />
        </div>
      </section>

      {/* Features */}
      <section className="home-features container">
        <h2 className="home-features-title">Todo lo que necesitás</h2>
        <p className="home-features-subtitle">Una plataforma completa para gestionar tu inventario sin complicaciones.</p>
        <div className="home-features-grid">
          {features.map((f, i) => (
            <div key={i} className="card feature-card">
              <div className="feature-icon" style={{ background: f.color }}>
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="home-testimonials container">
        <h2 className="home-testimonials-title">Lo que dicen nuestros clientes</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="card testimonial-card">
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="avatar" style={{ width: 38, height: 38, fontSize: 13 }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      {!user && (
        <section className="home-cta-banner container">
          <div className="card cta-banner">
            <h2>¿Listo para tomar el control de tu inventario?</h2>
            <p>Registrate gratis y empezá a gestionar tu stock en menos de 5 minutos.</p>
            <Link to="/registro" className="btn btn-primary btn-lg">
              Crear cuenta gratis →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
