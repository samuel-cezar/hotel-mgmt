import { useState, useEffect } from 'react';
import FormInput from '../Common/FormInput';
import FormSelect from '../Common/FormSelect';
import FormContainer from '../Common/FormContainer';
import Alert from '../Common/Alert';
import DataTable from '../Common/DataTable';
import { useCrudForm } from '../../hooks/useCrudForm';

// Validation functions
const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

const validateCheckInDate = (date) => {
  if (!date) return false;
  const checkIn = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return checkIn >= today;
};

const validateCheckOutDate = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return false;
  const entrada = new Date(checkIn);
  const saida = new Date(checkOut);
  return saida > entrada;
};

export default function ReservaForm() {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [quartos, setQuartos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [touched, setTouched] = useState({
    clienteId: false,
    quartoId: false,
    data_entrada: false,
    data_saida: false,
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
    clienteId: '',
    quartoId: '',
    data_entrada: '',
    data_saida: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reservasData, clientesData, quartosData] = await Promise.all([
        fetchData('/reservas'),
        fetchData('/clientes'),
        fetchData('/quartos'),
      ]);
      setReservas(reservasData);
      setClientes(clientesData);
      setQuartos(quartosData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clienteId || !formData.quartoId || !formData.data_entrada || !formData.data_saida) {
      return;
    }

    const entrada = new Date(formData.data_entrada);
    const saida = new Date(formData.data_saida);

    if (saida <= entrada) {
      return;
    }

    try {
      if (editingId) {
        await updateData(`/reservas/${editingId}`, formData);
      } else {
        await createData('/reservas', formData);
      }
      resetForm();
      setEditingId(null);
      loadData();
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };

  const handleEdit = (reserva) => {
    setEditingId(reserva.id);
    handleFieldChange('clienteId', reserva.clienteId);
    handleFieldChange('quartoId', reserva.quartoId);
    handleFieldChange('data_entrada', reserva.data_entrada.split('T')[0]);
    handleFieldChange('data_saida', reserva.data_saida.split('T')[0]);
  };

  const handleDelete = async (reserva) => {
    try {
      await deleteData(`/reservas/${reserva.id}`);
      loadData();
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingId(null);
    setTouched({
      clienteId: false,
      quartoId: false,
      data_entrada: false,
      data_saida: false,
    });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      validateRequired(formData.clienteId) &&
      validateRequired(formData.quartoId) &&
      validateCheckInDate(formData.data_entrada) &&
      validateCheckOutDate(formData.data_entrada, formData.data_saida)
    );
  };

  // Get field validation class
  const getFieldClass = (field, validator) => {
    if (!touched[field]) return '';
    return validator ? 'input-success' : 'input-error';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'cliente',
      label: 'Client',
      render: (_, row) => row.cliente?.nome || 'N/A',
    },
    {
      key: 'quarto',
      label: 'Room',
      render: (_, row) => `Room ${row.quarto?.numero}`,
    },
    {
      key: 'data_entrada',
      label: 'Check-in',
      render: (value) => formatDate(value),
    },
    {
      key: 'data_saida',
      label: 'Check-out',
      render: (value) => formatDate(value),
    },
    {
      key: 'valor_total',
      label: 'Total',
      render: (value) => `R$ ${parseFloat(value).toFixed(2)}`,
    },
  ];

  const clienteOptions = clientes.map((c) => ({
    value: c.id,
    label: c.nome,
  }));

  const quartoOptions = quartos.map((q) => ({
    value: q.id,
    label: `Room ${q.numero} - ${q.tipo} (R$ ${parseFloat(q.preco).toFixed(2)}/night)`,
  }));

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Reservation Management</h1>
          <p>Create, edit, and manage room reservations</p>
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
            title={editingId ? 'Edit Reservation' : 'New Reservation'}
            loading={loading}
            submitText={editingId ? 'Update Reservation' : 'Create Reservation'}
            onSubmit={handleSubmit}
            cancelButton={editingId}
            onCancel={handleCancel}
            disabled={!isFormValid()}
          >
            <FormSelect
              label="Client"
              name="clienteId"
              value={formData.clienteId}
              onChange={(e) => {
                handleFieldChange('clienteId', e.target.value);
                handleBlur('clienteId');
              }}
              options={clienteOptions}
              placeholder="Select a client"
              required
            />
            <FormSelect
              label="Room"
              name="quartoId"
              value={formData.quartoId}
              onChange={(e) => {
                handleFieldChange('quartoId', e.target.value);
                handleBlur('quartoId');
              }}
              options={quartoOptions}
              placeholder="Select a room"
              required
            />
            <FormInput
              label="Check-in Date"
              name="data_entrada"
              type="date"
              value={formData.data_entrada}
              onChange={(e) => handleFieldChange('data_entrada', e.target.value)}
              onBlur={() => handleBlur('data_entrada')}
              helpText="Must be today or a future date"
              required
              className={getFieldClass('data_entrada', validateCheckInDate(formData.data_entrada))}
            />
            <FormInput
              label="Check-out Date"
              name="data_saida"
              type="date"
              value={formData.data_saida}
              onChange={(e) => handleFieldChange('data_saida', e.target.value)}
              onBlur={() => handleBlur('data_saida')}
              helpText="Must be after check-in date"
              required
              className={getFieldClass('data_saida', validateCheckOutDate(formData.data_entrada, formData.data_saida))}
            />
          </FormContainer>
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Reservations List</h2>
          <DataTable
            columns={columns}
            data={reservas}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No reservations found. Create one to get started."
          />
        </div>
      </div>
    </div>
  );
}
