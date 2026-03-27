import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUsers, updateUser, toggleUser, deleteUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

function EditModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({ nombre: user.nombre, email: user.email, rol: user.rol });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim()) { toast.error('Nombre y email son requeridos'); return; }
    setLoading(true);
    try {
      const res = await updateUser(user._id, form);
      toast.success('Usuario actualizado');
      onSaved(res.data.user);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-glass" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const { user: me } = useAuth();

  useEffect(() => {
    getUsers()
      .then(r => setUsers(r.data.users))
      .catch(() => toast.error('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (u) => {
    try {
      const res = await toggleUser(u._id);
      setUsers(users.map(x => x._id === u._id ? res.data.user : x));
      toast.success(res.data.message);
    } catch { toast.error('Error al cambiar estado'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este usuario definitivamente?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      toast.success('Usuario eliminado');
    } catch { toast.error('Error al eliminar'); }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin — Usuarios</h1>
          <p className="page-subtitle">Gestioná las cuentas registradas en el sistema</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div className="glass stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{users.length}</div>
          <div className="stat-label">Total usuarios</div>
        </div>
        <div className="glass stat-card">
          <div className="stat-value" style={{ color: 'var(--accent3)' }}>{users.filter(u => u.activo).length}</div>
          <div className="stat-label">Activos</div>
        </div>
        <div className="glass stat-card">
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{users.filter(u => !u.activo).length}</div>
          <div className="stat-label">Suspendidos</div>
        </div>
        <div className="glass stat-card">
          <div className="stat-value" style={{ color: 'var(--accent2)' }}>{users.filter(u => u.rol === 'admin').length}</div>
          <div className="stat-label">Admins</div>
        </div>
      </div>

      <div className="glass">
        {loading ? <div className="spinner" /> : users.length === 0 ? (
          <div className="empty-state"><h3>No hay usuarios</h3></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Registrado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6ee7f7, #a78bfa)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.8rem', fontWeight: 700, color: '#0a0e1a', flexShrink: 0,
                        }}>
                          {u.nombre?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                          {u.nombre}
                          {u._id === me?._id && <span style={{ fontSize: '0.7rem', color: 'var(--accent)', marginLeft: 6 }}>(vos)</span>}
                        </span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={u.rol === 'admin' ? 'badge badge-purple' : 'badge badge-info'}>
                        {u.rol === 'admin' ? '👑 Admin' : '👤 Usuario'}
                      </span>
                    </td>
                    <td>
                      {u.activo
                        ? <span className="badge badge-success">Activo</span>
                        : <span className="badge badge-danger">Suspendido</span>}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(u.createdAt).toLocaleDateString('es-AR')}</td>
                    <td>
                      {u._id !== me?._id ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-glass btn-sm btn-icon" title="Editar" onClick={() => setEditing(u)}>✏️</button>
                          <button className={`btn btn-sm btn-icon ${u.activo ? 'btn-warning' : 'btn-success'}`}
                            title={u.activo ? 'Suspender' : 'Activar'}
                            onClick={() => handleToggle(u)}>
                            {u.activo ? '🔒' : '🔓'}
                          </button>
                          <button className="btn btn-danger btn-sm btn-icon" title="Eliminar" onClick={() => handleDelete(u._id)}>🗑️</button>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Tu cuenta</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <EditModal
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => setUsers(users.map(u => u._id === updated._id ? updated : u))}
        />
      )}
    </div>
  );
}
