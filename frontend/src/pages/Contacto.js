import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FormGroup } from '../components/UI';
import '../styles/pages.css';

const contactInfo = [
  { icon: '📧', label: 'Email', value: 'contacto@stockpro.com' },
  { icon: '📞', label: 'Teléfono', value: '+54 11 4000-0000' },
  { icon: '📍', label: 'Dirección', value: 'Av. Corrientes 1234, CABA, Argentina' },
  { icon: '🕐', label: 'Horario', value: 'Lunes a Viernes, 9:00 – 18:00' },
];

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.email.trim()) e.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.asunto.trim()) e.asunto = 'El asunto es requerido';
    if (!form.mensaje.trim()) e.mensaje = 'El mensaje es requerido';
    else if (form.mensaje.trim().length < 20) e.mensaje = 'El mensaje debe tener al menos 20 caracteres';
    return e;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }
    setSent(true);
    toast.success('¡Mensaje enviado! Te respondemos pronto.');
  };

  return (
    <main className="container page">
      <section className="contact-hero">
        <h1 className="about-title">Contacto</h1>
        <p className="about-desc">
          ¿Tenés alguna pregunta o querés saber más sobre StockPro? Mandanos un mensaje.
        </p>
      </section>

      <div className="contact-grid">
        {/* Info */}
        <div className="contact-info">
          {contactInfo.map((item, i) => (
            <div key={i} className="card contact-info-card">
              <div className="contact-info-icon">{item.icon}</div>
              <div>
                <div className="contact-info-label">{item.label}</div>
                <div className="contact-info-value">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 32 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
              <h3 style={{ marginBottom: 8, fontSize: '1.2rem' }}>¡Mensaje enviado!</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
                Te respondemos en menos de 24 horas hábiles.
              </p>
              <button className="btn btn-secondary" onClick={() => { setSent(false); setForm({ nombre: '', email: '', asunto: '', mensaje: '' }); }}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid-2">
                <FormGroup label="Nombre *" error={errors.nombre}>
                  <input type="text" name="nombre" className={`form-control ${errors.nombre ? 'error' : ''}`}
                    placeholder="Tu nombre" value={form.nombre} onChange={handleChange} />
                </FormGroup>
                <FormGroup label="Email *" error={errors.email}>
                  <input type="email" name="email" className={`form-control ${errors.email ? 'error' : ''}`}
                    placeholder="tu@email.com" value={form.email} onChange={handleChange} />
                </FormGroup>
              </div>
              <FormGroup label="Asunto *" error={errors.asunto}>
                <input type="text" name="asunto" className={`form-control ${errors.asunto ? 'error' : ''}`}
                  placeholder="¿En qué te podemos ayudar?" value={form.asunto} onChange={handleChange} />
              </FormGroup>
              <FormGroup label="Mensaje *" error={errors.mensaje}>
                <textarea name="mensaje" className={`form-control ${errors.mensaje ? 'error' : ''}`}
                  placeholder="Contanos tu consulta..." rows={5} value={form.mensaje} onChange={handleChange} />
              </FormGroup>
              <button type="submit" className="btn btn-primary btn-lg full-width">
                Enviar mensaje →
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
