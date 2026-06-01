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

  const handle = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { toast.error('El nombre es requerido'); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await updateCategory(editing._id, form);
        setCategories(prev => prev.map(c => c._id === editing._id ? res.data.category : c));
        toast.success('Categoría actualizada');
      } else {
        const res = await createCategory(form);
        setCategories(prev => [...prev, res.data.category]);
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
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.success('Categoría eliminada');
    } catch { toast.error('Error al eliminar'); }
  };

  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1 className="ph-title">Categorías</h1>
          <p className="ph-sub">Organizá el catálogo de productos</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => openModal()}>+ Nueva categoría</button>
      </div>

      {loading ? <div className="spin" /> : categories.length === 0 ? (
        <div className="empty card" style={{ padding: 56 }}>
          <h3 style={{ color: 'var(--t2)' }}>Sin categorías</h3>
          <p>Creá la primera con el botón de arriba</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
          {categories.map(c => (
            <div key={c._id} className="card" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--a)', marginTop: 6, flexShrink: 0,
                }} />
                <div style={{ display: 'flex', gap: 5 }}>
                  <button className="btn btn-glass btn-xs" onClick={() => openModal(c)}>Editar</button>
                  <button className="btn btn-danger btn-xs" onClick={() => handleDelete(c._id)}>Eliminar</button>
                </div>
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 5 }}>{c.nombre}</h3>
              {c.descripcion && <p style={{ color: 'var(--t3)', fontSize: '0.8rem', lineHeight: 1.55 }}>{c.descripcion}</p>}
              <div style={{ marginTop: 12, fontSize: '0.68rem', color: 'var(--t3)' }}>
                {new Date(c.createdAt).toLocaleDateString('es-AR')}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Editar categoría' : 'Nueva categoría'}</h2>
            <form onSubmit={handle}>
              <div className="field">
                <label>Nombre *</label>
                <input type="text" placeholder="Ej: Electrónica" value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })} autoFocus />
              </div>
              <div className="field">
                <label>Descripción</label>
                <textarea placeholder="Descripción opcional..." value={form.descripcion}
                  onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              </div>
              <div className="modal-footer">
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
