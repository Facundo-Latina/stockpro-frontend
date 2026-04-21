import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getProducts, getCategories } from '../services/api';
import { Spinner, EmptyState, PageHeader, StockBadge, StockBar } from '../components/UI';
import StockModal from '../components/StockModal';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const params = {};
      if (busqueda) params.busqueda = busqueda;
      if (categoriaFiltro) params.categoria = categoriaFiltro;
      const res = await getProducts(params);
      setProducts(res.data.products);
    } catch {
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [busqueda, categoriaFiltro]);

  useEffect(() => {
    getCategories()
      .then(r => setCategories(r.data.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleUpdated = (updated) => {
    setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
  };

  return (
    <div className="container page">
      <PageHeader
        title="Inventario"
        subtitle="Consultá y actualizá el stock de los productos"
      />

      <div className="search-bar">
        <input
          className="form-control"
          placeholder="🔍 Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <select
          className="form-control"
          value={categoriaFiltro}
          onChange={e => setCategoriaFiltro(e.target.value)}
          style={{ maxWidth: 220 }}
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="📦"
            title="No se encontraron productos"
            description="Probá con otro filtro o búsqueda"
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {products.map(p => (
            <ProductCard
              key={p._id}
              product={p}
              onUpdate={() => setSelected(p)}
            />
          ))}
        </div>
      )}

      {selected && (
        <StockModal
          product={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}

function ProductCard({ product: p, onUpdate }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <h3 style={{ fontSize: '0.975rem', fontWeight: 700, flex: 1, paddingRight: 8 }}>{p.nombre}</h3>
        <StockBadge stock={p.stock} stockMinimo={p.stockMinimo} />
      </div>

      {p.descripcion && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.55 }}>
          {p.descripcion}
        </p>
      )}

      {p.categoria && (
        <span className="badge badge-info" style={{ marginBottom: 14, display: 'inline-flex' }}>
          {p.categoria.nombre}
        </span>
      )}

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Stock
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Mín: {p.stockMinimo}
          </span>
        </div>
        <StockBar stock={p.stock} stockMinimo={p.stockMinimo} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        {p.precio > 0 ? (
          <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
            ${p.precio.toLocaleString('es-AR')}
          </span>
        ) : <span />}
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Control: {new Date(p.fechaUltimoControlStock).toLocaleDateString('es-AR')}
        </span>
      </div>

      <button className="btn btn-secondary full-width" onClick={onUpdate}>
        📝 Actualizar Stock
      </button>
    </div>
  );
}
