import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createProduct, updateProduct } from '../services/api';
import { Modal, FormGroup } from './UI';

export default function ProductForm({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    nombre: product?.nombre || '',
    descripcion: product?.descripcion || '',
    stock: product?.stock ?? '',
    precio: product?.precio || '',
    categoria: product?.categoria?._id || '',
    stockMinimo: product?.stockMinimo ?? 5,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    else if (form.nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres';
    if (form.stock === '') e.stock = 'El stock es requerido';
    else if (isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'El stock debe ser ≥ 0';
    if (form.precio !== '' && (isNaN(form.precio) || Number(form.precio) < 0)) {
      e.precio = 'El precio debe ser ≥ 0';
    }
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
      const data = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        stock: Number(form.stock),
        precio: Number(form.precio) || 0,
        categoria: form.categoria || null,
        stockMinimo: Number(form.stockMinimo) || 5,
      };
      const res = product
        ? await updateProduct(product._id, data)
        : await createProduct(data);
      toast.success(product ? 'Producto actualizado' : 'Producto creado');
      onSaved(res.data.product);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={product ? 'Editar Producto' : 'Nuevo Producto'}
      subtitle={product ? `Editando: ${product.nombre}` : 'Completá los datos del nuevo producto'}
      onClose={onClose}
      maxWidth={560}
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormGroup label="Nombre *" error={errors.nombre}>
          <input
            type="text"
            name="nombre"
            className={`form-control ${errors.nombre ? 'error' : ''}`}
            placeholder="Nombre del producto"
            value={form.nombre}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup label="Descripción" error={errors.descripcion}>
          <textarea
            name="descripcion"
            className="form-control"
            placeholder="Descripción opcional..."
            value={form.descripcion}
            onChange={handleChange}
          />
        </FormGroup>

        <div className="form-grid-2">
          <FormGroup label="Stock inicial *" error={errors.stock}>
            <input
              type="number"
              name="stock"
              min="0"
              className={`form-control ${errors.stock ? 'error' : ''}`}
              placeholder="0"
              value={form.stock}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup label="Stock mínimo">
            <input
              type="number"
              name="stockMinimo"
              min="0"
              className="form-control"
              placeholder="5"
              value={form.stockMinimo}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup label="Precio ($)" error={errors.precio}>
            <input
              type="number"
              name="precio"
              min="0"
              className={`form-control ${errors.precio ? 'error' : ''}`}
              placeholder="0.00"
              value={form.precio}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup label="Categoría">
            <select name="categoria" className="form-control" value={form.categoria} onChange={handleChange}>
              <option value="">Sin categoría</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.nombre}</option>
              ))}
            </select>
          </FormGroup>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
