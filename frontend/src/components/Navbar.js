import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './UI';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/quienes-somos', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
    ...(user ? [{ to: '/productos', label: 'Productos' }] : []),
  ];

  const adminLinks = isAdmin ? [
    { to: '/admin/productos', label: 'Inventario' },
    { to: '/admin/categorias', label: 'Categorías' },
    { to: '/admin/usuarios', label: 'Usuarios' },
  ] : [];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">SP</div>
          <span>StockPro</span>
        </Link>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`navbar-link ${isActive(l.to) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          {adminLinks.length > 0 && (
            <>
              <li className="navbar-divider" />
              {adminLinks.map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`navbar-link navbar-link-admin ${isActive(l.to) ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user">
              <Avatar nombre={user.nombre} size={32} />
              <div className="navbar-user-info">
                <span className="navbar-user-name">{user.nombre}</span>
                <span className="navbar-user-role">{user.rol === 'admin' ? 'Administrador' : 'Usuario'}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Salir
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-secondary btn-sm">Ingresar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Registrarse</Link>
            </div>
          )}
          <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
