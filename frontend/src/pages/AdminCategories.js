import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { Spinner, EmptyState, PageHeader, ConfirmModal, Modal, FormGroup } from '../components/UI';

function CategoryModal({ category, onClose, onSaved }) {
  const [form, setForm] = useState({ nombre: category?.nombre || '', descripcion: category?.descripcion || '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    else if (form.nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres';
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
      const res = category
        ? await updateCategory(category._id, form)
        : await createCategory(form);
      toast.success(category ? 'Categoría actualizada' : 'Categoría creada');
      onSaved(res.data.category);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={category ? 'Editar Categoría' : 'Nueva Categoría'}
      onClose={onClose}
      maxWidth={440}
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormGroup label="Nombre *" error={errors.nombre}>
          <input
            type="text"
            name="nombre"
            className={`form-control ${errors.nombre ? 'error' : ''}`}
            placeholder="Ej: Electrónica"
            value={form.nombre}
            onChange={handleChange}
            autoFocus
          />
        </FormGroup>
        <FormGroup label="Descripción">
          <textarea
            name="descripcion"
            className="form-control"
            placeholder="Descripción opcional..."
            value={form.descripcion}
            onChange={handleChange}
          />
        </FormGroup>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : category ? 'Guardar cambios' : 'Crear categoría'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const CATEGORY_ICONS = ['🏷️', '📦', '⚡', '🔧', '🎯', '💡', '🏠', '🚗', '💊', '🍎', '👕', '📱'];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    getCategories()
      .then(r => setCategories(r.data.categories))
      .catch(() => toast.error('Error al cargar categorías'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaved = (saved) => {
    setCategories(prev => {
      const exists = prev.find(c => c._id === saved._id);
      return exists ? prev.map(c => c._id === saved._id ? saved : c) : [...prev, saved];
    });
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(deleting._id);
      setCategories(prev => prev.filter(c => c._id !== deleting._id));
      toast.success('Categoría eliminada');
    } catch {
      toast.error('Error al eliminar la categoría');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="container page">
      <PageHeader
        title="Categorías"
        subtitle="Organizá tus productos con categorías personalizadas"
        action={
          <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
            + Nueva Categoría
          </button>
        }
      />

      {loading ? (
        <Spinner />
      ) : categories.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="🏷️"
            title="No hay categorías"
            description="Creá la primera para organizar tus productos"
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {categories.map((c, i) => (
            <div key={c._id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: 'var(--accent-dim)',
                  border: '1px solid rgba(99,210,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem',
                }}>
                  {CATEGORY_ICONS[i % CATEGORY_ICONS.length]}
                </div>
                <div className="flex gap-8">
                  <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setEditing(c); setModalOpen(true); }}>✏️</button>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleting(c)}>🗑️</button>
                </div>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>{c.nombre}</h3>
              {c.descripcion && (
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{c.descripcion}</p>
              )}
              <div style={{ marginTop: 14, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Creada el {new Date(c.createdAt).toLocaleDateString('es-AR')}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <CategoryModal
          category={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}

      {deleting && (
        <ConfirmModal
          title="Eliminar categoría"
          message={`¿Eliminás la categoría "${deleting.nombre}"? Los productos asociados quedarán sin categoría.`}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
