import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(10, 14, 26, 0.7)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '0 24px',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  logo: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#6ee7f7',
    textDecoration: 'none',
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    listStyle: 'none',
  },
  link: (active) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontWeight: 500,
    textDecoration: 'none',
    color: active ? '#6ee7f7' : 'rgba(240,244,255,0.6)',
    background: active ? 'rgba(110,231,247,0.1)' : 'transparent',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'Outfit, sans-serif',
  }),
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6ee7f7, #a78bfa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#0a0e1a',
  },
  mobileBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(240,244,255,0.7)',
    cursor: 'pointer',
    fontSize: '1.4rem',
    display: 'none',
  },
};

export default function Navbar() {
  const { user, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          📦 StockPro
        </Link>

        <ul style={styles.links}>
          <li><Link to="/" style={styles.link(location.pathname === '/')}>Inicio</Link></li>
          <li><Link to="/quienes-somos" style={styles.link(isActive('/quienes-somos'))}>Nosotros</Link></li>
          <li><Link to="/contacto" style={styles.link(isActive('/contacto'))}>Contacto</Link></li>
          {user && <li><Link to="/productos" style={styles.link(isActive('/productos'))}>Productos</Link></li>}
          {isAdmin && (
            <>
              <li><Link to="/admin/productos" style={styles.link(isActive('/admin/productos'))}>Admin Productos</Link></li>
              <li><Link to="/admin/categorias" style={styles.link(isActive('/admin/categorias'))}>Categorías</Link></li>
              <li><Link to="/admin/usuarios" style={styles.link(isActive('/admin/usuarios'))}>Usuarios</Link></li>
            </>
          )}
        </ul>

        <div style={styles.userInfo}>
          {user ? (
            <>
              <div style={styles.avatar}>{user.nombre?.charAt(0).toUpperCase()}</div>
              <span style={{ fontSize: '0.85rem', color: 'rgba(240,244,255,0.6)' }}>{user.nombre}</span>
              <button onClick={handleLogout} className="btn btn-glass btn-sm">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-glass btn-sm">Ingresar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
