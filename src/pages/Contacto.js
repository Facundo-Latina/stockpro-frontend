import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.email) e.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.asunto.trim()) e.asunto = 'El asunto es requerido';
    if (!form.mensaje.trim()) e.mensaje = 'El mensaje es requerido';
    else if (form.mensaje.trim().length < 20) e.mensaje = 'El mensaje debe tener al menos 20 caracteres';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSent(true);
    toast.success('¡Mensaje enviado! Te responderemos pronto.');
    setForm({ nombre: '', email: '', asunto: '', mensaje: '' });
    setErrors({});
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14 }}>
          Contacto
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          ¿Tenés alguna pregunta? Mandanos un mensaje y te respondemos a la brevedad.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { icon: '📧', label: 'Email', value: 'info@stockpro.com' },
            { icon: '📞', label: 'Teléfono', value: '+54 381 000-0000' },
            { icon: '📍', label: 'Ubicación', value: 'Tucumán, Argentina' },
          ].map((item, i) => (
            <div key={i} className="glass" style={{ padding: 20 }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="glass" style={{ padding: 32 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>¡Mensaje enviado!</h3>
              <p style={{ color: 'var(--text-muted)' }}>Te responderemos pronto.</p>
              <button className="btn btn-glass" style={{ marginTop: 20 }} onClick={() => setSent(false)}>
                Enviar otro
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <div className="form-group">
                  <label>Nombre *</label>
                  <input type="text" placeholder="Tu nombre" value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    className={errors.nombre ? 'input-error' : ''} />
                  {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" placeholder="tu@email.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={errors.email ? 'input-error' : ''} />
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Asunto *</label>
                <input type="text" placeholder="¿En qué podemos ayudarte?" value={form.asunto}
                  onChange={e => setForm({ ...form, asunto: e.target.value })}
                  className={errors.asunto ? 'input-error' : ''} />
                {errors.asunto && <span className="error-msg">{errors.asunto}</span>}
              </div>
              <div className="form-group">
                <label>Mensaje *</label>
                <textarea placeholder="Escribí tu mensaje aquí..." rows={5} value={form.mensaje}
                  onChange={e => setForm({ ...form, mensaje: e.target.value })}
                  className={errors.mensaje ? 'input-error' : ''} />
                {errors.mensaje && <span className="error-msg">{errors.mensaje}</span>}
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                Enviar mensaje →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
