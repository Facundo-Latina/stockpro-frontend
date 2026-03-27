import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../services/api';

const emptyForm = { nombre: '', descripcion: '', stock: '', precio: '', categoria: '', stockMinimo: 5 };

function ProductModal({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState(product ? {
    nombre: product.nombre, descripcion: product.descripcion || '',
    stock: product.stock, precio: product.precio || '',
    categoria: product.categoria?._id || '', stockMinimo: product.stockMinimo || 5,
  } : emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (form.stock === '' || form.stock < 0) e.stock = 'El stock debe ser ≥ 0';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    try {
      const data = { ...form, stock: Number(form.stock), precio: Number(form.precio) || 0, stockMinimo: Number(form.stockMinimo) || 5 };
      const res = product ? await updateProduct(product._id, data) : await createProduct(data);
      toast.success(product ? 'Producto actualizado' : 'Producto creado');
      onSaved(res.data.product);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <h2>{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Nombre *</label>
              <input type="text" placeholder="Nombre del producto" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                className={errors.nombre ? 'input-error' : ''} />
              {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Descripción</label>
              <textarea placeholder="Descripción opcional..." value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input type="number" min="0" placeholder="0" value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                className={errors.stock ? 'input-error' : ''} />
              {errors.stock && <span className="error-msg">{errors.stock}</span>}
            </div>

            <div className="form-group">
              <label>Stock mínimo</label>
              <input type="number" min="0" placeholder="5" value={form.stockMinimo}
                onChange={e => setForm({ ...form, stockMinimo: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Precio ($)</label>
              <input type="number" min="0" placeholder="0" value={form.precio}
                onChange={e => setForm({ ...form, precio: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                <option value="">Sin categoría</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-glass" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  const fetchAll = async () => {
    try {
      const params = { soloActivos: 'false' };
      if (busqueda) params.busqueda = busqueda;
      if (categoriaFiltro) params.categoria = categoriaFiltro;
      const [pRes, cRes] = await Promise.all([getProducts(params), getCategories()]);
      setProducts(pRes.data.products);
      setCategories(cRes.data.categories);
    } catch { toast.error('Error al cargar datos'); }
    finally { setLoading(false); }
  };

  useEffect(() => { const t = setTimeout(fetchAll, 300); return () => clearTimeout(t); }, [busqueda, categoriaFiltro]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.map(p => p._id === id ? { ...p, activo: false } : p));
      toast.success('Producto eliminado');
    } catch { toast.error('Error al eliminar'); }
  };

  const handleSaved = (saved) => {
    setProducts(prev => {
      const exists = prev.find(p => p._id === saved._id);
      return exists ? prev.map(p => p._id === saved._id ? saved : p) : [saved, ...prev];
    });
  };

  const stockColor = (p) => {
    if (p.stock === 0) return 'var(--danger)';
    if (p.stock <= p.stockMinimo) return 'var(--warning)';
    return 'var(--accent3)';
  };

  const totals = {
    total: products.filter(p => p.activo).length,
    sinStock: products.filter(p => p.activo && p.stock === 0).length,
    bajo: products.filter(p => p.activo && p.stock > 0 && p.stock <= p.stockMinimo).length,
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin — Productos</h1>
          <p className="page-subtitle">Gestioná el catálogo completo de productos</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
          + Nuevo Producto
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div className="glass stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{totals.total}</div>
          <div className="stat-label">Total activos</div>
        </div>
        <div className="glass stat-card">
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{totals.sinStock}</div>
          <div className="stat-label">Sin stock</div>
        </div>
        <div className="glass stat-card">
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{totals.bajo}</div>
          <div className="stat-label">Stock bajo</div>
        </div>
      </div>

      <div className="search-bar">
        <input placeholder="🔍 Buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
        </select>
      </div>

      <div className="glass">
        {loading ? <div className="spinner" /> : products.length === 0 ? (
          <div className="empty-state"><h3>No hay productos</h3><p>Creá el primero con el botón de arriba</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Último control</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.nombre}</div>
                      {p.descripcion && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{p.descripcion.slice(0, 50)}{p.descripcion.length > 50 && '...'}</div>}
                    </td>
                    <td>{p.categoria ? <span className="badge badge-info">{p.categoria.nombre}</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td><span style={{ fontWeight: 700, color: stockColor(p), fontSize: '1.1rem' }}>{p.stock}</span><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 4 }}>/ mín {p.stockMinimo}</span></td>
                    <td>{p.precio > 0 ? `$${p.precio.toLocaleString()}` : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(p.fechaUltimoControlStock).toLocaleDateString('es-AR')}</td>
                    <td>{p.activo ? <span className="badge badge-success">Activo</span> : <span className="badge badge-danger">Inactivo</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-glass btn-sm btn-icon" title="Editar"
                          onClick={() => { setEditing(p); setModalOpen(true); }}>✏️</button>
                        <button className="btn btn-danger btn-sm btn-icon" title="Eliminar"
                          onClick={() => handleDelete(p._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <ProductModal
          product={editing}
          categories={categories}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
