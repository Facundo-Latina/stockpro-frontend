import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUsers, updateUser, toggleUser, deleteUser } from '../services/api';
import { Spinner, EmptyState, PageHeader, StatCard, Avatar, ConfirmModal, Modal, FormGroup } from '../components/UI';
import { useAuth } from '../context/AuthContext';

function EditUserModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({ nombre: user.nombre, email: user.email, rol: user.rol });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!form.email.trim()) e.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    return e;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const res = await updateUser(user._id, form);
      toast.success('Usuario actualizado');
      onSaved(res.data.user);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Editar Usuario" subtitle={`Editando: ${user.nombre}`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <FormGroup label="Nombre" error={errors.nombre}>
          <input type="text" name="nombre" className={`form-control ${errors.nombre ? 'error' : ''}`}
            value={form.nombre} onChange={handleChange} />
        </FormGroup>
        <FormGroup label="Email" error={errors.email}>
          <input type="email" name="email" className={`form-control ${errors.email ? 'error' : ''}`}
            value={form.email} onChange={handleChange} />
        </FormGroup>
        <FormGroup label="Rol">
          <select name="rol" className="form-control" value={form.rol} onChange={handleChange}>
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </FormGroup>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
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
    } catch {
      toast.error('Error al cambiar el estado del usuario');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleting._id);
      setUsers(prev => prev.filter(u => u._id !== deleting._id));
      toast.success('Usuario eliminado');
    } catch {
      toast.error('Error al eliminar el usuario');
    } finally {
      setDeleting(null);
    }
  };

  const stats = {
    total: users.length,
    activos: users.filter(u => u.activo).length,
    suspendidos: users.filter(u => !u.activo).length,
    admins: users.filter(u => u.rol === 'admin').length,
  };

  return (
    <div className="container page">
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administrá las cuentas registradas en el sistema"
      />

      <div className="stats-grid">
        <StatCard value={stats.total} label="Total usuarios" color="var(--accent)" />
        <StatCard value={stats.activos} label="Activos" color="var(--green)" />
        <StatCard value={stats.suspendidos} label="Suspendidos" color="var(--red)" />
        <StatCard value={stats.admins} label="Administradores" color="var(--accent2)" />
      </div>

      <div className="card">
        {loading ? (
          <Spinner />
        ) : users.length === 0 ? (
          <EmptyState icon="👥" title="No hay usuarios registrados" />
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
                      <div className="flex align-center gap-8">
                        <Avatar nombre={u.nombre} size={32} />
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                          {u.nombre}
                          {u._id === me?._id && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--accent)', marginLeft: 8 }}>
                              (vos)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      {u.rol === 'admin'
                        ? <span className="badge badge-purple">👑 Admin</span>
                        : <span className="badge badge-info">👤 Usuario</span>}
                    </td>
                    <td>
                      {u.activo
                        ? <span className="badge badge-success">Activo</span>
                        : <span className="badge badge-danger">Suspendido</span>}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td>
                      {u._id === me?._id ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tu cuenta</span>
                      ) : (
                        <div className="flex gap-8">
                          <button className="btn btn-secondary btn-sm btn-icon" title="Editar"
                            onClick={() => setEditing(u)}>✏️</button>
                          <button
                            className={`btn btn-sm btn-icon ${u.activo ? 'btn-warning' : 'btn-success'}`}
                            title={u.activo ? 'Suspender' : 'Activar'}
                            onClick={() => handleToggle(u)}
                          >
                            {u.activo ? '🔒' : '🔓'}
                          </button>
                          <button className="btn btn-danger btn-sm btn-icon" title="Eliminar"
                            onClick={() => setDeleting(u)}>🗑️</button>
                        </div>
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
        <EditUserModal
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => setUsers(prev => prev.map(u => u._id === updated._id ? updated : u))}
        />
      )}

      {deleting && (
        <ConfirmModal
          title="Eliminar usuario"
          message={`¿Estás seguro que querés eliminar la cuenta de "${deleting.nombre}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
