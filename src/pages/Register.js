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
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.email) e.email = 'Requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.password) e.password = 'Requerido';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirmar) e.confirmar = 'No coincide';
    return e;
  };

  const handle = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await register({ nombre: form.nombre, email: form.email, password: form.password });
      loginUser(res.data.token, res.data.user);
      toast.success('Cuenta creada');
      navigate('/productos');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrarse');
    } finally { setLoading(false); }
  };

  const set = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 1 }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: '36px 32px' }}>

        <div style={{ marginBottom: 26 }}>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Crear cuenta</h1>
          <p style={{ color: 'var(--t3)', fontSize: '0.82rem', marginTop: 4 }}>Registrate en StockPro</p>
        </div>

        <form onSubmit={handle}>
          <div className="field">
            <label>Nombre</label>
            <input type="text" placeholder="Tu nombre" value={form.nombre} onChange={set('nombre')} className={errors.nombre ? 'field-err' : ''} />
            {errors.nombre && <span className="err-msg">{errors.nombre}</span>}
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="tu@email.com" value={form.email} onChange={set('email')} className={errors.email ? 'field-err' : ''} />
            {errors.email && <span className="err-msg">{errors.email}</span>}
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={set('password')} className={errors.password ? 'field-err' : ''} />
            {errors.password && <span className="err-msg">{errors.password}</span>}
          </div>
          <div className="field">
            <label>Confirmar</label>
            <input type="password" placeholder="Repetí la contraseña" value={form.confirmar} onChange={set('confirmar')} className={errors.confirmar ? 'field-err' : ''} />
            {errors.confirmar && <span className="err-msg">{errors.confirmar}</span>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 6, padding: 11, borderRadius: 999 }}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.82rem', color: 'var(--t3)' }}>
          Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--a)', textDecoration: 'none', fontWeight: 500 }}>Ingresar</Link>
        </p>
      </div>
    </div>
  );
}
