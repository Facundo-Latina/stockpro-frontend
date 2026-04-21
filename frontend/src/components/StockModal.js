import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateStock } from '../services/api';
import { Modal, FormGroup } from './UI';

export default function StockModal({ product, onClose, onUpdated }) {
  const [operacion, setOperacion] = useState('set');
  const [cantidad, setCantidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!cantidad && cantidad !== 0) return 'La cantidad es requerida';
    if (isNaN(cantidad) || Number(cantidad) < 0) return 'Ingresá un número válido mayor o igual a 0';
    if (operacion === 'subtract' && Number(cantidad) > product.stock) {
      return `No podés restar más del stock actual (${product.stock})`;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const res = await updateStock(product._id, { stock: Number(cantidad), operacion });
      toast.success('Stock actualizado correctamente');
      onUpdated(res.data.product);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar stock');
    } finally {
      setLoading(false);
    }
  };

  const preview = () => {
    const n = Number(cantidad);
    if (isNaN(n) || cantidad === '') return null;
    if (operacion === 'add') return product.stock + n;
    if (operacion === 'subtract') return Math.max(0, product.stock - n);
    return n;
  };

  const stockPreview = preview();

  return (
    <Modal
      title="Actualizar Stock"
      subtitle={`Producto: ${product.nombre}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormGroup label="Operación">
          <select
            className="form-control"
            value={operacion}
            onChange={e => { setOperacion(e.target.value); setError(''); }}
          >
            <option value="set">Establecer valor exacto</option>
            <option value="add">Agregar unidades</option>
            <option value="subtract">Restar unidades</option>
          </select>
        </FormGroup>

        <FormGroup label="Cantidad" error={error}>
          <input
            type="number"
            min="0"
            className={`form-control ${error ? 'error' : ''}`}
            placeholder="Ej: 10"
            value={cantidad}
            onChange={e => { setCantidad(e.target.value); setError(''); }}
          />
        </FormGroup>

        {stockPreview !== null && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Stock actual: <strong style={{ color: 'var(--text)' }}>{product.stock}</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Resultado: <strong style={{ color: stockPreview === 0 ? 'var(--red)' : stockPreview <= product.stockMinimo ? 'var(--yellow)' : 'var(--green)' }}>
                {stockPreview}
              </strong>
            </span>
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Actualizar Stock'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
