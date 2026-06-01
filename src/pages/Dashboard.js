import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getStats, getProducts } from '../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(12,17,32,0.95)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem', color: '#f1f5f9',
    }}>
      <p style={{ color: 'var(--t3)', marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 600 }}>{payload[0].value} productos</p>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStats(),
      getProducts({ soloActivos: 'true', limit: 100 }),
    ]).then(([s, p]) => {
      setStats(s.data);
      const prods = p.data.products;
      const low = prods.filter(x => x.stock > 0 && x.stock <= x.stockMinimo);
      const zero = prods.filter(x => x.stock === 0);
      setAlerts([...zero, ...low].slice(0, 8));
    }).catch(() => toast.error('Error al cargar dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spin" style={{ minHeight: '80vh' }} />;

  const COLORS = ['#5eead4', '#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];

  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1 className="ph-title">Dashboard</h1>
          <p className="ph-sub">Resumen del estado del inventario</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { n: stats.total,         l: 'Productos activos', c: 'var(--a)' },
          { n: stats.enStock,       l: 'En stock',          c: 'var(--a3)' },
          { n: stats.bajosDeStock,  l: 'Stock bajo',        c: 'var(--warn)' },
          { n: stats.sinStock,      l: 'Sin stock',         c: 'var(--err)' },
        ].map((s, i) => (
          <div key={i} className="card stat">
            <div className="stat-n" style={{ color: s.c }}>{s.n}</div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

        {/* Bar chart */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--t2)', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Productos por categoría
          </h3>
          {stats.porCategoria?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.porCategoria} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="nombre" tick={{ fill: 'rgba(241,245,249,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(241,245,249,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.porCategoria.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty"><p>Sin datos de categorías</p></div>
          )}
        </div>

        {/* Stock overview */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--t2)', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Distribución de stock
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'En stock', value: stats.enStock, total: stats.total, color: 'var(--a3)' },
              { label: 'Stock bajo', value: stats.bajosDeStock, total: stats.total, color: 'var(--warn)' },
              { label: 'Sin stock', value: stats.sinStock, total: stats.total, color: 'var(--err)' },
            ].map((r, i) => {
              const pct = stats.total > 0 ? Math.round((r.value / stats.total) * 100) : 0;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--t2)' }}>{r.label}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: r.color }}>{r.value} <span style={{ color: 'var(--t3)', fontWeight: 400 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: r.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alert table */}
      {alerts.length > 0 && (
        <div className="card">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gl-border)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Alertas de stock ({alerts.length})
            </h3>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock actual</th>
                  <th>Mínimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(p => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 500, color: 'var(--t1)' }}>{p.nombre}</td>
                    <td>{p.categoria ? <span className="badge badge-info">{p.categoria.nombre}</span> : <span style={{ color: 'var(--t3)' }}>—</span>}</td>
                    <td style={{ fontWeight: 700, color: p.stock === 0 ? 'var(--err)' : 'var(--warn)', fontVariantNumeric: 'tabular-nums' }}>{p.stock}</td>
                    <td style={{ color: 'var(--t3)' }}>{p.stockMinimo}</td>
                    <td>
                      {p.stock === 0
                        ? <span className="badge badge-err">Sin stock</span>
                        : <span className="badge badge-warn">Bajo</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
