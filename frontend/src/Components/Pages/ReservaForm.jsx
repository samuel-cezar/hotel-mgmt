import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../Common/FormInput';
import FormSelect from '../Common/FormSelect';
import FormContainer from '../Common/FormContainer';
import Alert from '../Common/Alert';
import DataTable from '../Common/DataTable';
import { useCrudForm } from '../../hooks/useCrudForm';

// Funções de validação
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

  // Verifica se o formulário é válido
  const isFormValid = () => {
    return (
      validateRequired(formData.clienteId) &&
      validateRequired(formData.quartoId) &&
      validateCheckInDate(formData.data_entrada) &&
      validateCheckOutDate(formData.data_entrada, formData.data_saida)
    );
  };

  // Obtém a classe de validação do campo
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
      label: 'Cliente',
      render: (_, row) =>
        row.cliente ? (
          <Link
            to="/clientes"
            state={{ editItem: row.cliente }}
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-dark)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
          >
            {row.cliente.nome}
          </Link>
        ) : 'N/D',
    },
    {
      key: 'quarto',
      label: 'Quarto',
      render: (_, row) =>
        row.quarto ? (
          <Link
            to="/quartos"
            state={{ editItem: row.quarto }}
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-dark)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
          >
            Quarto {row.quarto.numero}
          </Link>
        ) : 'N/D',
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
    label: `Quarto ${q.numero} - ${q.tipo} (R$ ${parseFloat(q.preco).toFixed(2)}/noite)`,
  }));

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Gerenciamento de Reservas</h1>
          <p>Crie, edite e gerencie reservas de quartos</p>
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
            title={editingId ? 'Editar Reserva' : 'Nova Reserva'}
            loading={loading}
            submitText={editingId ? 'Atualizar Reserva' : 'Criar Reserva'}
            onSubmit={handleSubmit}
            cancelButton={editingId}
            onCancel={handleCancel}
            disabled={!isFormValid()}
          >
            <FormSelect
              label="Cliente"
              name="clienteId"
              value={formData.clienteId}
              onChange={(e) => {
                handleFieldChange('clienteId', e.target.value);
                handleBlur('clienteId');
              }}
              options={clienteOptions}
              placeholder="Selecione um cliente"
              required
            />
            <FormSelect
              label="Quarto"
              name="quartoId"
              value={formData.quartoId}
              onChange={(e) => {
                handleFieldChange('quartoId', e.target.value);
                handleBlur('quartoId');
              }}
              options={quartoOptions}
              placeholder="Selecione um quarto"
              required
            />
            <FormInput
              label="Data de Check-in"
              name="data_entrada"
              type="date"
              value={formData.data_entrada}
              onChange={(e) => handleFieldChange('data_entrada', e.target.value)}
              onBlur={() => handleBlur('data_entrada')}
              helpText="Deve ser hoje ou uma data futura"
              required
              className={getFieldClass('data_entrada', validateCheckInDate(formData.data_entrada))}
            />
            <FormInput
              label="Data de Check-out"
              name="data_saida"
              type="date"
              value={formData.data_saida}
              onChange={(e) => handleFieldChange('data_saida', e.target.value)}
              onBlur={() => handleBlur('data_saida')}
              helpText="Deve ser após a data de check-in"
              required
              className={getFieldClass('data_saida', validateCheckOutDate(formData.data_entrada, formData.data_saida))}
            />
          </FormContainer>
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Lista de Reservas</h2>
          <DataTable
            columns={columns}
            data={reservas}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="Nenhuma reserva encontrada. Crie uma para começar."
          />
        </div>
      </div>
    </div>
  );
}
