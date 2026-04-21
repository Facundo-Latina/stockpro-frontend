import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getProducts, getCategories, deleteProduct } from '../services/api';
import { Spinner, EmptyState, PageHeader, StatCard, StockBadge, ConfirmModal } from '../components/UI';
import ProductForm from '../components/ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      const params = { soloActivos: 'false' };
      if (busqueda) params.busqueda = busqueda;
      if (categoriaFiltro) params.categoria = categoriaFiltro;
      const [pRes, cRes] = await Promise.all([getProducts(params), getCategories()]);
      setProducts(pRes.data.products);
      setCategories(cRes.data.categories);
    } catch {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [busqueda, categoriaFiltro]);

  useEffect(() => {
    const timer = setTimeout(fetchAll, 300);
    return () => clearTimeout(timer);
  }, [fetchAll]);

  const handleDelete = async () => {
    try {
      await deleteProduct(deleting._id);
      setProducts(prev => prev.map(p => p._id === deleting._id ? { ...p, activo: false } : p));
      toast.success('Producto eliminado');
    } catch {
      toast.error('Error al eliminar el producto');
    } finally {
      setDeleting(null);
    }
  };

  const handleSaved = (saved) => {
    setProducts(prev => {
      const exists = prev.find(p => p._id === saved._id);
      return exists ? prev.map(p => p._id === saved._id ? saved : p) : [saved, ...prev];
    });
  };

  const activeProducts = products.filter(p => p.activo);
  const stats = {
    total: activeProducts.length,
    sinStock: activeProducts.filter(p => p.stock === 0).length,
    bajo: activeProducts.filter(p => p.stock > 0 && p.stock <= p.stockMinimo).length,
    ok: activeProducts.filter(p => p.stock > p.stockMinimo).length,
  };

  return (
    <div className="container page">
      <PageHeader
        title="Gestión de Productos"
        subtitle="Creá, editá y eliminá los productos del inventario"
        action={
          <button className="btn btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
            + Nuevo Producto
          </button>
        }
      />

      <div className="stats-grid">
        <StatCard value={stats.total} label="Total activos" color="var(--accent)" />
        <StatCard value={stats.ok} label="En stock" color="var(--green)" />
        <StatCard value={stats.bajo} label="Stock bajo" color="var(--yellow)" />
        <StatCard value={stats.sinStock} label="Sin stock" color="var(--red)" />
      </div>

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
          {categories.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <EmptyState icon="📦" title="No hay productos" description="Creá el primero con el botón de arriba" />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
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
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{p.nombre}</div>
                      {p.descripcion && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {p.descripcion.length > 55 ? p.descripcion.slice(0, 55) + '...' : p.descripcion}
                        </div>
                      )}
                    </td>
                    <td>
                      {p.categoria
                        ? <span className="badge badge-info">{p.categoria.nombre}</span>
                        : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td>
                      <StockBadge stock={p.stock} stockMinimo={p.stockMinimo} />
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {p.stock} uds · mín {p.stockMinimo}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {p.precio > 0 ? `$${p.precio.toLocaleString('es-AR')}` : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(p.fechaUltimoControlStock).toLocaleDateString('es-AR')}
                    </td>
                    <td>
                      {p.activo
                        ? <span className="badge badge-success">Activo</span>
                        : <span className="badge badge-danger">Inactivo</span>}
                    </td>
                    <td>
                      <div className="flex gap-8">
                        <button
                          className="btn btn-secondary btn-sm btn-icon"
                          title="Editar"
                          onClick={() => { setEditing(p); setFormOpen(true); }}
                        >✏️</button>
                        <button
                          className="btn btn-danger btn-sm btn-icon"
                          title="Eliminar"
                          onClick={() => setDeleting(p)}
                        >🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}

      {deleting && (
        <ConfirmModal
          title="Eliminar producto"
          message={`¿Estás seguro que querés eliminar "${deleting.nombre}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
