import { useState, useEffect } from 'react';
import FormInput from '../Common/FormInput';
import FormSelect from '../Common/FormSelect';
import FormCheckbox from '../Common/FormCheckbox';
import FormContainer from '../Common/FormContainer';
import Alert from '../Common/Alert';
import DataTable from '../Common/DataTable';
import { useCrudForm } from '../../hooks/useCrudForm';

export default function QuartoForm() {
  const [quartos, setQuartos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const {
    formData,
    handleFieldChange,
    successMessage,
    errorMessage,
    loading,
    fetchData,
    createData,
    updateData,
    deleteData,
    clearMessages,
    resetForm,
  } = useCrudForm({
    numero: '',
    tipo: 'Simples',
    preco: '',
    disponivel: true,
  });

  useEffect(() => {
    loadQuartos();
  }, []);

  const loadQuartos = async () => {
    try {
      const data = await fetchData('/quartos');
      setQuartos(data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.numero || !formData.tipo || !formData.preco) {
      return;
    }

    if (formData.preco <= 0) {
      return;
    }

    try {
      if (editingId) {
        await updateData(`/quartos/${editingId}`, formData);
      } else {
        await createData('/quartos', formData);
      }
      resetForm();
      setEditingId(null);
      loadQuartos();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleEdit = (quarto) => {
    setEditingId(quarto.id);
    Object.keys(quarto).forEach((key) => {
      if (key in formData) {
        handleFieldChange(key, quarto[key]);
      }
    });
  };

  const handleDelete = async (quarto) => {
    try {
      await deleteData(`/quartos/${quarto.id}`);
      loadQuartos();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingId(null);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'numero', label: 'Number' },
    { key: 'tipo', label: 'Type' },
    {
      key: 'preco',
      label: 'Price/Night',
      render: (value) => `R$ ${parseFloat(value).toFixed(2)}`,
    },
    {
      key: 'disponivel',
      label: 'Available',
      render: (value) => (value ? '✓ Yes' : '✗ No'),
    },
  ];

  const roomTypeOptions = [
    { value: 'Simples', label: 'Single' },
    { value: 'Duplo', label: 'Double' },
    { value: 'Suíte', label: 'Suite' },
  ];

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Room Management</h1>
          <p>Create, edit, and manage hotel rooms</p>
        </div>

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={clearMessages}
            dismissible
          />
        )}

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            onClose={clearMessages}
            dismissible
          />
        )}

        <div style={{ marginBottom: '3rem' }}>
          <FormContainer
            title={editingId ? 'Edit Room' : 'New Room'}
            loading={loading}
            submitText={editingId ? 'Update Room' : 'Create Room'}
            onSubmit={handleSubmit}
            cancelButton={editingId}
            onCancel={handleCancel}
          >
            <FormInput
              label="Room Number"
              name="numero"
              type="text"
              value={formData.numero}
              onChange={(e) => handleFieldChange('numero', e.target.value)}
              placeholder="e.g., 101, 202"
              helpText="Unique room identifier"
              required
            />
            <FormSelect
              label="Room Type"
              name="tipo"
              value={formData.tipo}
              onChange={(e) => handleFieldChange('tipo', e.target.value)}
              options={roomTypeOptions}
              required
            />
            <FormInput
              label="Price per Night"
              name="preco"
              type="number"
              value={formData.preco}
              onChange={(e) => handleFieldChange('preco', e.target.value)}
              placeholder="0.00"
              step="0.01"
              helpText="Daily rate in Brazilian Real"
              required
            />
            <FormCheckbox
              label="Available"
              name="disponivel"
              checked={formData.disponivel}
              onChange={(e) => handleFieldChange('disponivel', e.target.checked)}
              helpText="Check if this room is available for booking"
            />
          </FormContainer>
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Rooms List</h2>
          <DataTable
            columns={columns}
            data={quartos}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No rooms found. Create one to get started."
          />
        </div>
      </div>
    </div>
  );
}
