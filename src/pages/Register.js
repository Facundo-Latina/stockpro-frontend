import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.email) e.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.password) e.password = 'La contraseña es requerida';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirmar) e.confirmar = 'Las contraseñas no coinciden';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 1 }}>
      <div className="glass" style={{ width: '100%', maxWidth: 440, padding: '40px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>✨</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 6 }}>Crear cuenta</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Registrate en StockPro</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input type="text" placeholder="Tu nombre" value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              className={errors.nombre ? 'input-error' : ''} />
            {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="tu@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className={errors.email ? 'input-error' : ''} />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="Mínimo 6 caracteres" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className={errors.password ? 'input-error' : ''} />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input type="password" placeholder="Repetí la contraseña" value={form.confirmar}
              onChange={e => setForm({ ...form, confirmar: e.target.value })}
              className={errors.confirmar ? 'input-error' : ''} />
            {errors.confirmar && <span className="error-msg">{errors.confirmar}</span>}
          </div>

          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: 14 }}
            disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Ingresar</Link>
        </p>
      </div>
    </div>
  );
}
