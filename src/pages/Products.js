import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getProducts, getCategories, updateStock } from '../services/api';
import useDebounce from '../hooks/useDebounce';

function StockModal({ product, onClose, onUpdated }) {
  const [op, setOp] = useState('set');
  const [qty, setQty] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (qty === '' || isNaN(qty) || Number(qty) < 0) { toast.error('Cantidad inválida'); return; }
    setLoading(true);
    try {
      const res = await updateStock(product._id, { stock: Number(qty), operacion: op });
      toast.success('Stock actualizado');
      onUpdated(res.data.product);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <h2>Actualizar stock</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--t3)', marginBottom: 18 }}>
          {product.nombre} — actual: <strong style={{ color: 'var(--a)' }}>{product.stock}</strong>
        </p>
        <form onSubmit={handle}>
          <div className="field">
            <label>Operación</label>
            <select value={op} onChange={e => setOp(e.target.value)}>
              <option value="set">Establecer valor</option>
              <option value="add">Sumar al stock</option>
              <option value="subtract">Restar del stock</option>
            </select>
          </div>
          <div className="field">
            <label>Cantidad</label>
            <input type="number" min="0" placeholder="0" value={qty} onChange={e => setQty(e.target.value)} autoFocus />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-glass" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const stockState = (p) => {
  if (p.stock === 0) return { label: 'Sin stock', cls: 'badge-err', color: 'var(--err)' };
  if (p.stock <= p.stockMinimo) return { label: 'Stock bajo', cls: 'badge-warn', color: 'var(--warn)' };
  return { label: 'OK', cls: 'badge-ok', color: 'var(--a3)' };
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const dSearch = useDebounce(search, 380);

  const fetchCategories = useCallback(() => {
    getCategories().then(r => setCategories(r.data.categories)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 16 };
    if (dSearch) params.busqueda = dSearch;
    if (cat) params.categoria = cat;
    getProducts(params)
      .then(r => { setProducts(r.data.products); setPages(r.data.pages); })
      .catch(() => toast.error('Error al cargar productos'))
      .finally(() => setLoading(false));
  }, [dSearch, cat, page]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { setPage(1); }, [dSearch, cat]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const exportCSV = () => {
    const rows = [['Nombre', 'Categoría', 'Stock', 'Mínimo', 'Precio']];
    products.forEach(p => rows.push([
      p.nombre, p.categoria?.nombre || '', p.stock, p.stockMinimo, p.precio || 0,
    ]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'stockpro-productos.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1 className="ph-title">Productos</h1>
          <p className="ph-sub">Consultá y actualizá el stock de los productos</p>
        </div>
        <button className="btn btn-glass btn-sm" onClick={exportCSV}>Exportar CSV</button>
      </div>

      <div className="sb">
        <input placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
        </select>
      </div>

      {loading ? <div className="spin" /> : products.length === 0 ? (
        <div className="empty card" style={{ padding: 56 }}>
          <h3 style={{ color: 'var(--t2)' }}>Sin resultados</h3>
          <p>Probá con otro filtro</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
            {products.map(p => {
              const st = stockState(p);
              return (
                <div key={p._id} className="card" style={{ padding: '20px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, flex: 1, paddingRight: 8, lineHeight: 1.3 }}>{p.nombre}</h3>
                    <span className={`badge ${st.cls}`}>{st.label}</span>
                  </div>

                  {p.descripcion && (
                    <p style={{ color: 'var(--t3)', fontSize: '0.78rem', marginBottom: 12, lineHeight: 1.5 }}>
                      {p.descripcion.slice(0, 60)}{p.descripcion.length > 60 && '…'}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                    {p.categoria && <span className="badge badge-info">{p.categoria.nombre}</span>}
                    {p.precio > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--t3)' }}>${p.precio.toLocaleString('es-AR')}</span>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(255,255,255,0.025)', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 2 }}>Stock</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 700, color: st.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{p.stock}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 2 }}>Mínimo</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--t2)' }}>{p.stockMinimo}</div>
                    </div>
                  </div>

                  <button className="btn btn-glass" style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
                    onClick={() => setSelected(p)}>
                    Actualizar stock
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
              <button className="btn btn-glass btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.82rem', color: 'var(--t3)', padding: '0 4px' }}>
                {page} / {pages}
              </span>
              <button className="btn btn-glass btn-sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Siguiente</button>
            </div>
          )}
        </>
      )}

      {selected && (
        <StockModal
          product={selected}
          onClose={() => setSelected(null)}
          onUpdated={updated => setProducts(prev => prev.map(p => p._id === updated._id ? updated : p))}
        />
      )}
    </div>
  );
}
