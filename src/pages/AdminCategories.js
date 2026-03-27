import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories()
      .then(r => setCategories(r.data.categories))
      .catch(() => toast.error('Error al cargar categorías'))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (cat = null) => {
    setEditing(cat);
    setForm(cat ? { nombre: cat.nombre, descripcion: cat.descripcion || '' } : { nombre: '', descripcion: '' });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { toast.error('El nombre es requerido'); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await updateCategory(editing._id, form);
        setCategories(categories.map(c => c._id === editing._id ? res.data.category : c));
        toast.success('Categoría actualizada');
      } else {
        const res = await createCategory(form);
        setCategories([...categories, res.data.category]);
        toast.success('Categoría creada');
      }
      setModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c._id !== id));
      toast.success('Categoría eliminada');
    } catch { toast.error('Error al eliminar'); }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin — Categorías</h1>
          <p className="page-subtitle">Organizá tus productos con categorías</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>+ Nueva Categoría</button>
      </div>

      {loading ? <div className="spinner" /> : categories.length === 0 ? (
        <div className="glass empty-state" style={{ padding: 60 }}>
          <h3>No hay categorías</h3>
          <p>Creá la primera para organizar tus productos</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {categories.map(c => (
            <div key={c._id} className="glass" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(110,231,247,0.2), rgba(167,139,250,0.2))',
                  border: '1px solid rgba(110,231,247,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem',
                }}>🏷️</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-glass btn-sm btn-icon" onClick={() => openModal(c)}>✏️</button>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(c._id)}>🗑️</button>
                </div>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 6 }}>{c.nombre}</h3>
              {c.descripcion && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{c.descripcion}</p>}
              <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Creada: {new Date(c.createdAt).toLocaleDateString('es-AR')}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input type="text" placeholder="Ej: Electrónica" value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea placeholder="Descripción opcional..." value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-glass" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
