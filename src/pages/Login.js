import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.password) e.password = 'Requerido';
    return e;
  };

  const handle = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      toast.success(`Bienvenido, ${res.data.user.nombre}`);
      navigate('/productos');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al iniciar sesión');
    } finally { setLoading(false); }
  };

  const set = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 1 }}>
      <div className="card" style={{ width: '100%', maxWidth: 380, padding: '36px 32px' }}>

        <div style={{ marginBottom: 26 }}>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Iniciar sesión</h1>
          <p style={{ color: 'var(--t3)', fontSize: '0.82rem', marginTop: 4 }}>Ingresá a tu cuenta de StockPro</p>
        </div>

        <form onSubmit={handle}>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="tu@email.com" value={form.email} onChange={set('email')} className={errors.email ? 'field-err' : ''} />
            {errors.email && <span className="err-msg">{errors.email}</span>}
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={set('password')} className={errors.password ? 'field-err' : ''} />
            {errors.password && <span className="err-msg">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 6, padding: '11px', borderRadius: 999 }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.82rem', color: 'var(--t3)' }}>
          Sin cuenta?{' '}
          <Link to="/registro" style={{ color: 'var(--a)', textDecoration: 'none', fontWeight: 500 }}>Registrarte</Link>
        </p>
      </div>
    </div>
  );
}
