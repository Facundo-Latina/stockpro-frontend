import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FormGroup } from '../components/UI';
import '../styles/auth.css';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    else if (form.nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres';
    if (!form.email.trim()) e.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Formato de email inválido';
    if (!form.password) e.password = 'La contraseña es requerida';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (!form.confirmar) e.confirmar = 'Confirmá tu contraseña';
    else if (form.password !== form.confirmar) e.confirmar = 'Las contraseñas no coinciden';
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
      const res = await register({ nombre: form.nombre, email: form.email, password: form.password });
      loginUser(res.data.token, res.data.user);
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/productos');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card" style={{ maxWidth: 460 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">SP</div>
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">Registrate en StockPro gratis</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FormGroup label="Nombre completo" error={errors.nombre}>
            <input
              type="text"
              name="nombre"
              className={`form-control ${errors.nombre ? 'error' : ''}`}
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              autoComplete="name"
            />
          </FormGroup>

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

          <div className="form-grid-2">
            <FormGroup label="Contraseña" error={errors.password}>
              <input
                type="password"
                name="password"
                className={`form-control ${errors.password ? 'error' : ''}`}
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </FormGroup>

            <FormGroup label="Confirmar contraseña" error={errors.confirmar}>
              <input
                type="password"
                name="confirmar"
                className={`form-control ${errors.confirmar ? 'error' : ''}`}
                placeholder="Repetí la contraseña"
                value={form.confirmar}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </FormGroup>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg full-width"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}
