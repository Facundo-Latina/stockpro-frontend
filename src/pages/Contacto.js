import React, { useState } from 'react';

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.email) e.email = 'Requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.asunto.trim()) e.asunto = 'Requerido';
    if (form.mensaje.trim().length < 20) e.mensaje = 'Mínimo 20 caracteres';
    return e;
  };

  const handle = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSent(true);
  };

  const set = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 5 }}>Contacto</h1>
        <p style={{ color: 'var(--t3)', fontSize: '0.85rem' }}>Tenés alguna pregunta? Te respondemos pronto.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { l: 'Email',     v: 'info@stockpro.com' },
            { l: 'Teléfono', v: '+54 381 000-0000' },
            { l: 'Ubicación', v: 'Tucumán, Argentina' },
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--t3)', marginBottom: 4, fontWeight: 600 }}>{item.l}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--t2)' }}>{item.v}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '26px 28px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a3)', fontWeight: 700, fontSize: '1rem' }}>✓</div>
              <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>Mensaje enviado</h3>
              <p style={{ color: 'var(--t3)', fontSize: '0.82rem' }}>Te respondemos pronto.</p>
              <button className="btn btn-glass btn-sm" style={{ marginTop: 16 }} onClick={() => setSent(false)}>Enviar otro</button>
            </div>
          ) : (
            <form onSubmit={handle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
                <div className="field">
                  <label>Nombre *</label>
                  <input type="text" placeholder="Tu nombre" value={form.nombre} onChange={set('nombre')} className={errors.nombre ? 'field-err' : ''} />
                  {errors.nombre && <span className="err-msg">{errors.nombre}</span>}
                </div>
                <div className="field">
                  <label>Email *</label>
                  <input type="email" placeholder="tu@email.com" value={form.email} onChange={set('email')} className={errors.email ? 'field-err' : ''} />
                  {errors.email && <span className="err-msg">{errors.email}</span>}
                </div>
              </div>
              <div className="field">
                <label>Asunto *</label>
                <input type="text" placeholder="En qué podemos ayudarte?" value={form.asunto} onChange={set('asunto')} className={errors.asunto ? 'field-err' : ''} />
                {errors.asunto && <span className="err-msg">{errors.asunto}</span>}
              </div>
              <div className="field">
                <label>Mensaje *</label>
                <textarea rows={4} placeholder="Escribí tu mensaje..." value={form.mensaje} onChange={set('mensaje')} className={errors.mensaje ? 'field-err' : ''} />
                {errors.mensaje && <span className="err-msg">{errors.mensaje}</span>}
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 11, borderRadius: 999 }}>
                Enviar mensaje
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
