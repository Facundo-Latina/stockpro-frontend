import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUsers, updateUser, toggleUser, deleteUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

function EditModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({ nombre: user.nombre, email: user.email, rol: user.rol });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim()) { toast.error('Nombre y email requeridos'); return; }
    setLoading(true);
    try {
      const res = await updateUser(user._id, form);
      toast.success('Usuario actualizado');
      onSaved(res.data.user);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Editar usuario</h2>
        <form onSubmit={handle}>
          <div className="field">
            <label>Nombre</label>
            <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>Rol</label>
            <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-glass" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
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
      setUsers(prev => prev.map(x => x._id === u._id ? res.data.user : x));
      toast.success(res.data.message);
    } catch { toast.error('Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('Usuario eliminado');
    } catch { toast.error('Error al eliminar'); }
  };

  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1 className="ph-title">Usuarios</h1>
          <p className="ph-sub">Gestioná las cuentas registradas</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { n: users.length,                              l: 'Total',       c: 'var(--a)' },
          { n: users.filter(u => u.activo).length,        l: 'Activos',     c: 'var(--a3)' },
          { n: users.filter(u => !u.activo).length,       l: 'Suspendidos', c: 'var(--err)' },
          { n: users.filter(u => u.rol === 'admin').length, l: 'Admins',    c: 'var(--a2)' },
        ].map((s, i) => (
          <div key={i} className="card stat">
            <div className="stat-n" style={{ color: s.c }}>{s.n}</div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="card">
        {loading ? <div className="spin" /> : users.length === 0 ? (
          <div className="empty"><h3 style={{ color: 'var(--t2)' }}>Sin usuarios</h3></div>
        ) : (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Estado</th><th>Registrado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #5eead4, #818cf8)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.72rem', fontWeight: 700, color: '#05101c', flexShrink: 0,
                        }}>
                          {u.nombre?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--t1)' }}>
                          {u.nombre}
                          {u._id === me?._id && <span style={{ fontSize: '0.65rem', color: 'var(--a)', marginLeft: 5 }}>(vos)</span>}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--t2)' }}>{u.email}</td>
                    <td>
                      <span className={u.rol === 'admin' ? 'badge badge-ind' : 'badge badge-info'}>
                        {u.rol === 'admin' ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                    <td>{u.activo ? <span className="badge badge-ok">Activo</span> : <span className="badge badge-err">Suspendido</span>}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--t3)' }}>{new Date(u.createdAt).toLocaleDateString('es-AR')}</td>
                    <td>
                      {u._id !== me?._id ? (
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button className="btn btn-glass btn-xs" onClick={() => setEditing(u)}>Editar</button>
                          <button className={`btn btn-xs ${u.activo ? 'btn-warn' : 'btn-ok'}`} onClick={() => handleToggle(u)}>
                            {u.activo ? 'Suspender' : 'Activar'}
                          </button>
                          <button className="btn btn-danger btn-xs" onClick={() => handleDelete(u._id)}>Eliminar</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--t3)' }}>Tu cuenta</span>
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
          onSaved={updated => setUsers(prev => prev.map(u => u._id === updated._id ? updated : u))}
        />
      )}
    </div>
  );
}
