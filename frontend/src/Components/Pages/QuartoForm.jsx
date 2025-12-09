import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FormInput from '../Common/FormInput';
import FormSelect from '../Common/FormSelect';
import FormCheckbox from '../Common/FormCheckbox';
import FormContainer from '../Common/FormContainer';
import Alert from '../Common/Alert';
import DataTable from '../Common/DataTable';
import { useCrudForm } from '../../hooks/useCrudForm';

// Validation functions
const validateRoomNumber = (numero) => {
  return numero.trim().length > 0;
};

const validatePrice = (preco) => {
  const price = parseFloat(preco);
  return !isNaN(price) && price > 0;
};

const validateRoomType = (tipo) => {
  return tipo && tipo.trim().length > 0;
};

export default function QuartoForm() {
  const location = useLocation();
  const [quartos, setQuartos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [touched, setTouched] = useState({
    numero: false,
    preco: false,
  });
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

  // Handle navigation from QuartoList with edit item
  useEffect(() => {
    if (location.state?.editItem) {
      const quarto = location.state.editItem;
      handleEdit(quarto);
      // Clear the state to avoid re-triggering on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
    setTouched({
      numero: false,
      preco: false,
    });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      validateRoomNumber(formData.numero) &&
      validateRoomType(formData.tipo) &&
      validatePrice(formData.preco)
    );
  };

  // Get field validation class
  const getFieldClass = (field, validator) => {
    if (!touched[field]) return '';
    return validator(formData[field]) ? 'input-success' : 'input-error';
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
            disabled={!isFormValid()}
          >
            <FormInput
              label="Room Number"
              name="numero"
              type="text"
              value={formData.numero}
              onChange={(e) => handleFieldChange('numero', e.target.value)}
              onBlur={() => handleBlur('numero')}
              placeholder="e.g., 101, 202"
              helpText="Unique room identifier"
              required
              className={getFieldClass('numero', validateRoomNumber)}
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
              onBlur={() => handleBlur('preco')}
              placeholder="0.00"
              step="0.01"
              helpText="Daily rate in Brazilian Real (must be greater than 0)"
              required
              className={getFieldClass('preco', validatePrice)}
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
