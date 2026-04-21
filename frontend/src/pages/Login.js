import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FormGroup } from '../components/UI';
import '../styles/auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Formato de email inválido';
    if (!form.password) e.password = 'La contraseña es requerida';
    return e;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      toast.success(`Bienvenido, ${res.data.user.nombre}`);
      navigate('/productos');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al iniciar sesión';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">SP</div>
          <h1 className="auth-title">Iniciar sesión</h1>
          <p className="auth-subtitle">Ingresá a tu cuenta de StockPro</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FormGroup label="Email" error={errors.email}>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </FormGroup>

          <FormGroup label="Contraseña" error={errors.password}>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </FormGroup>

          <button
            type="submit"
            className="btn btn-primary btn-lg full-width"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="auth-demo">
          <strong>Cuenta admin de prueba:</strong><br />
          admin@stockpro.com / Admin2024!
        </div>

        <div className="auth-footer">
          ¿No tenés cuenta?{' '}
          <Link to="/registro">Registrarte gratis</Link>
        </div>
      </div>
    </div>
  );
}
