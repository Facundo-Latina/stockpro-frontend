import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="card notfound-card">
        <div className="notfound-code">404</div>
        <h2 className="notfound-title">Página no encontrada</h2>
        <p className="notfound-desc">
          La página que estás buscando no existe o fue movida a otra dirección.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
