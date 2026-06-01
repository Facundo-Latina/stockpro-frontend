import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  const isActive = (p) => pathname === p || (p !== '/' && pathname.startsWith(p));

  const linkCss = (p) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '5px 12px',
    borderRadius: 999,
    fontSize: '0.82rem',
    fontWeight: 500,
    textDecoration: 'none',
    color: isActive(p) ? '#f1f5f9' : 'rgba(241,245,249,0.52)',
    background: isActive(p) ? 'rgba(255,255,255,0.12)' : 'transparent',
    transition: 'all 0.18s',
    border: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  return (
    /* sticky wrapper — full width, not the pill */
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center',
      padding: scrolled ? '10px 24px' : '14px 24px',
      transition: 'padding 0.3s ease',
      pointerEvents: 'none',
    }}>
      {/* The liquid-glass pill itself */}
      <nav
        className="lgl-pill"
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '6px 10px',
          /* pill doesn't reach screen edges — controlled by max-width */
          width: '100%',
          maxWidth: 860,
          transition: 'box-shadow 0.3s ease, max-width 0.3s ease',
          boxShadow: scrolled
            ? '0 4px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -1px 0 rgba(0,0,0,0.20)'
            : '0 2px 40px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.16)',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: '#f1f5f9',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
          padding: '5px 12px',
          marginRight: 4,
          flexShrink: 0,
        }}>
          StockPro
        </Link>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', marginRight: 4, flexShrink: 0 }} />

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, overflow: 'hidden' }}>
          <Link to="/"              style={linkCss('/')}>Inicio</Link>
          <Link to="/quienes-somos" style={linkCss('/quienes-somos')}>Nosotros</Link>
          <Link to="/contacto"      style={linkCss('/contacto')}>Contacto</Link>
          {user && <Link to="/productos" style={linkCss('/productos')}>Productos</Link>}
          {isAdmin && <>
            <Link to="/dashboard"        style={linkCss('/dashboard')}>Dashboard</Link>
            <Link to="/admin/productos"  style={linkCss('/admin/productos')}>Inventario</Link>
            <Link to="/admin/categorias" style={linkCss('/admin/categorias')}>Categorías</Link>
            <Link to="/admin/usuarios"   style={linkCss('/admin/usuarios')}>Usuarios</Link>
          </>}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 4 }}>
          {user ? (
            <>
              {/* Avatar bubble */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #5eead4, #818cf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 700, color: '#05101c',
                flexShrink: 0,
              }}>
                {user.nombre?.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} className="btn btn-glass btn-sm"
                style={{ borderRadius: 999, fontSize: '0.78rem', padding: '4px 12px' }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-glass btn-sm" style={{ borderRadius: 999, fontSize: '0.78rem', padding: '4px 12px' }}>Ingresar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm" style={{ borderRadius: 999, fontSize: '0.78rem', padding: '4px 12px' }}>Registrarse</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
