import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProducts, getCategories, updateStock } from '../services/api';

function StockModal({ product, onClose, onUpdated }) {
  const [operacion, setOperacion] = useState('set');
  const [cantidad, setCantidad] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cantidad || isNaN(cantidad) || Number(cantidad) < 0) {
      toast.error('Ingresá una cantidad válida'); return;
    }
    setLoading(true);
    try {
      const res = await updateStock(product._id, { stock: Number(cantidad), operacion });
      toast.success('Stock actualizado');
      onUpdated(res.data.product);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar stock');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>Actualizar Stock</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
          Producto: <strong style={{ color: 'var(--text-primary)' }}>{product.nombre}</strong>
          &nbsp;— Stock actual: <strong style={{ color: 'var(--accent)' }}>{product.stock}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Operación</label>
            <select value={operacion} onChange={e => setOperacion(e.target.value)}>
              <option value="set">Establecer valor exacto</option>
              <option value="add">Agregar al stock actual</option>
              <option value="subtract">Restar del stock actual</option>
            </select>
          </div>
          <div className="form-group">
            <label>Cantidad</label>
            <input type="number" min="0" placeholder="Ej: 10" value={cantidad}
              onChange={e => setCantidad(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-glass" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchProducts = async () => {
    try {
      const params = {};
      if (busqueda) params.busqueda = busqueda;
      if (categoriaFiltro) params.categoria = categoriaFiltro;
      const res = await getProducts(params);
      setProducts(res.data.products);
    } catch { toast.error('Error al cargar productos'); }
    finally { setLoading(false); }
  };

  useEffect(() => { getCategories().then(r => setCategories(r.data.categories)).catch(() => {}); }, []);
  useEffect(() => { const t = setTimeout(fetchProducts, 300); return () => clearTimeout(t); }, [busqueda, categoriaFiltro]);

  const stockColor = (p) => {
    if (p.stock === 0) return 'var(--danger)';
    if (p.stock <= p.stockMinimo) return 'var(--warning)';
    return 'var(--accent3)';
  };

  const stockBadge = (p) => {
    if (p.stock === 0) return <span className="badge badge-danger">Sin stock</span>;
    if (p.stock <= p.stockMinimo) return <span className="badge badge-warning">Stock bajo</span>;
    return <span className="badge badge-success">OK</span>;
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">Visualizá y actualizá el stock de los productos</p>
        </div>
      </div>

      <div className="search-bar">
        <input placeholder="🔍 Buscar producto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
        </select>
      </div>

      {loading ? <div className="spinner" /> : products.length === 0 ? (
        <div className="empty-state glass" style={{ padding: 60 }}>
          <h3>No se encontraron productos</h3>
          <p>Probá con otro filtro o búsqueda</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {products.map(p => (
            <div key={p._id} className="glass" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, flex: 1 }}>{p.nombre}</h3>
                {stockBadge(p)}
              </div>

              {p.descripcion && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 14, lineHeight: 1.5 }}>
                  {p.descripcion}
                </p>
              )}

              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                {p.categoria && <span className="badge badge-info">{p.categoria.nombre}</span>}
                {p.precio > 0 && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>${p.precio.toLocaleString()}</span>
                )}
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 10,
                padding: '14px 16px', marginBottom: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4 }}>
                    Stock actual
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: stockColor(p), lineHeight: 1 }}>
                    {p.stock}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4 }}>
                    Mínimo
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.stockMinimo}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                Último control: {new Date(p.fechaUltimoControlStock).toLocaleDateString('es-AR')}
              </div>

              <button className="btn btn-glass" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setSelected(p)}>
                📝 Actualizar Stock
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <StockModal
          product={selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => setProducts(products.map(p => p._id === updated._id ? updated : p))}
        />
      )}
    </div>
  );
}
