import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../services/api';
import useDebounce from '../hooks/useDebounce';

const EMPTY = { nombre: '', descripcion: '', stock: '', precio: '', categoria: '', stockMinimo: 5 };

function ProductModal({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState(product ? {
    nombre: product.nombre, descripcion: product.descripcion || '',
    stock: product.stock, precio: product.precio || '',
    categoria: product.categoria?._id || '', stockMinimo: product.stockMinimo ?? 5,
  } : EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (form.stock === '' || Number(form.stock) < 0) e.stock = 'Debe ser >= 0';
    return e;
  };

  const handle = async (e) => {
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

  const set = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <h2>{product ? 'Editar producto' : 'Nuevo producto'}</h2>
        <form onSubmit={handle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <label>Nombre *</label>
              <input type="text" placeholder="Nombre del producto" value={form.nombre} onChange={set('nombre')} className={errors.nombre ? 'field-err' : ''} />
              {errors.nombre && <span className="err-msg">{errors.nombre}</span>}
            </div>
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <label>Descripción</label>
              <textarea placeholder="Opcional..." value={form.descripcion} onChange={set('descripcion')} style={{ minHeight: 64 }} />
            </div>
            <div className="field">
              <label>Stock *</label>
              <input type="number" min="0" placeholder="0" value={form.stock} onChange={set('stock')} className={errors.stock ? 'field-err' : ''} />
              {errors.stock && <span className="err-msg">{errors.stock}</span>}
            </div>
            <div className="field">
              <label>Stock mínimo</label>
              <input type="number" min="0" placeholder="5" value={form.stockMinimo} onChange={set('stockMinimo')} />
            </div>
            <div className="field">
              <label>Precio ($)</label>
              <input type="number" min="0" placeholder="0" value={form.precio} onChange={set('precio')} />
            </div>
            <div className="field">
              <label>Categoría</label>
              <select value={form.categoria} onChange={set('categoria')}>
                <option value="">Sin categoría</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-glass" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const stockColor = (p) => {
  if (p.stock === 0) return 'var(--err)';
  if (p.stock <= p.stockMinimo) return 'var(--warn)';
  return 'var(--a3)';
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const dSearch = useDebounce(search, 380);

  const fetchAll = useCallback(() => {
    setLoading(true);
    const params = { soloActivos: 'false', page, limit: 15 };
    if (dSearch) params.busqueda = dSearch;
    if (cat) params.categoria = cat;
    Promise.all([getProducts(params), getCategories()])
      .then(([p, c]) => {
        setProducts(p.data.products);
        setPages(p.data.pages);
        setTotal(p.data.total);
        setCategories(c.data.categories);
      })
      .catch(() => toast.error('Error al cargar datos'))
      .finally(() => setLoading(false));
  }, [dSearch, cat, page]);

  useEffect(() => { setPage(1); }, [dSearch, cat]);
  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.map(p => p._id === id ? { ...p, activo: false } : p));
      toast.success('Producto eliminado');
    } catch { toast.error('Error al eliminar'); }
  };

  const handleSaved = (saved) => {
    setProducts(prev => {
      const exists = prev.find(p => p._id === saved._id);
      return exists ? prev.map(p => p._id === saved._id ? saved : p) : [saved, ...prev];
    });
  };

  const exportCSV = () => {
    const rows = [['Nombre', 'Categoría', 'Stock', 'Mínimo', 'Precio', 'Estado']];
    products.forEach(p => rows.push([p.nombre, p.categoria?.nombre || '', p.stock, p.stockMinimo, p.precio || 0, p.activo ? 'Activo' : 'Inactivo']));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'inventario.csv'; a.click();
  };

  const active = products.filter(p => p.activo);

  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1 className="ph-title">Inventario</h1>
          <p className="ph-sub">{total} productos en total</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-glass btn-sm" onClick={exportCSV}>Exportar CSV</button>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setModal(true); }}>+ Nuevo producto</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { n: active.length,                                     l: 'Activos',    c: 'var(--a)' },
          { n: active.filter(p => p.stock === 0).length,          l: 'Sin stock',  c: 'var(--err)' },
          { n: active.filter(p => p.stock > 0 && p.stock <= p.stockMinimo).length, l: 'Stock bajo', c: 'var(--warn)' },
        ].map((s, i) => (
          <div key={i} className="card stat">
            <div className="stat-n" style={{ color: s.c }}>{s.n}</div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="sb">
        <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
        </select>
      </div>

      <div className="card">
        {loading ? <div className="spin" /> : products.length === 0 ? (
          <div className="empty"><h3 style={{ color: 'var(--t2)' }}>Sin productos</h3><p>Creá el primero con el botón de arriba</p></div>
        ) : (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th><th>Categoría</th><th>Stock</th>
                  <th>Precio</th><th>Último control</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--t1)' }}>{p.nombre}</div>
                      {p.descripcion && <div style={{ fontSize: '0.72rem', color: 'var(--t3)', marginTop: 1 }}>{p.descripcion.slice(0, 48)}{p.descripcion.length > 48 && '…'}</div>}
                    </td>
                    <td>{p.categoria ? <span className="badge badge-info">{p.categoria.nombre}</span> : <span style={{ color: 'var(--t3)' }}>—</span>}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: stockColor(p), fontVariantNumeric: 'tabular-nums' }}>{p.stock}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--t3)', marginLeft: 4 }}>/ {p.stockMinimo}</span>
                    </td>
                    <td>{p.precio > 0 ? `$${p.precio.toLocaleString('es-AR')}` : <span style={{ color: 'var(--t3)' }}>—</span>}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--t3)' }}>{new Date(p.fechaUltimoControlStock).toLocaleDateString('es-AR')}</td>
                    <td>{p.activo ? <span className="badge badge-ok">Activo</span> : <span className="badge badge-err">Inactivo</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="btn btn-glass btn-xs" onClick={() => { setEditing(p); setModal(true); }}>Editar</button>
                        <button className="btn btn-danger btn-xs" onClick={() => handleDelete(p._id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <button className="btn btn-glass btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.82rem', color: 'var(--t3)', padding: '0 4px' }}>{page} / {pages}</span>
          <button className="btn btn-glass btn-sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Siguiente</button>
        </div>
      )}

      {modal && (
        <ProductModal
          product={editing} categories={categories}
          onClose={() => { setModal(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
