import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FormInput from '../Common/FormInput';
import FormSelect from '../Common/FormSelect';
import FormCheckbox from '../Common/FormCheckbox';
import FormContainer from '../Common/FormContainer';
import Alert from '../Common/Alert';
import DataTable from '../Common/DataTable';
import { useCrudForm } from '../../hooks/useCrudForm';

// Funções de validação
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

  // Manipula navegação da QuartoList com item de edição
  useEffect(() => {
    if (location.state?.editItem) {
      const quarto = location.state.editItem;
      handleEdit(quarto);
      // Limpa o estado para evitar re-renderização
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

  // Verifica se o formulário é válido
  const isFormValid = () => {
    return (
      validateRoomNumber(formData.numero) &&
      validateRoomType(formData.tipo) &&
      validatePrice(formData.preco)
    );
  };

  // Obtém a classe de validação do campo
  const getFieldClass = (field, validator) => {
    if (!touched[field]) return '';
    return validator(formData[field]) ? 'input-success' : 'input-error';
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'numero', label: 'Número' },
    { key: 'tipo', label: 'Tipo' },
    {
      key: 'preco',
      label: 'Preço/Noite',
      render: (value) => `R$ ${parseFloat(value).toFixed(2)}`,
    },
    {
      key: 'disponivel',
      label: 'Disponível',
      render: (value) => (value ? '✓ Sim' : '✗ Não'),
    },
  ];

  const roomTypeOptions = [
    { value: 'Simples', label: 'Simples' },
    { value: 'Duplo', label: 'Duplo' },
    { value: 'Suíte', label: 'Suíte' },
  ];

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Gerenciamento de Quartos</h1>
          <p>Crie, edite e gerencie quartos do hotel</p>
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
            title={editingId ? 'Editar Quarto' : 'Novo Quarto'}
            loading={loading}
            submitText={editingId ? 'Atualizar Quarto' : 'Criar Quarto'}
            onSubmit={handleSubmit}
            cancelButton={editingId}
            onCancel={handleCancel}
            disabled={!isFormValid()}
          >
            <FormInput
              label="Número do Quarto"
              name="numero"
              type="text"
              value={formData.numero}
              onChange={(e) => handleFieldChange('numero', e.target.value)}
              onBlur={() => handleBlur('numero')}
              placeholder="ex: 101, 202"
              helpText="Identificador único do quarto"
              required
              className={getFieldClass('numero', validateRoomNumber)}
            />
            <FormSelect
              label="Tipo do Quarto"
              name="tipo"
              value={formData.tipo}
              onChange={(e) => handleFieldChange('tipo', e.target.value)}
              options={roomTypeOptions}
              required
            />
            <FormInput
              label="Preço por Noite"
              name="preco"
              type="number"
              value={formData.preco}
              onChange={(e) => handleFieldChange('preco', e.target.value)}
              onBlur={() => handleBlur('preco')}
              placeholder="0.00"
              step="0.01"
              helpText="Valor da diária em Reais (deve ser maior que 0)"
              required
              className={getFieldClass('preco', validatePrice)}
            />
            <FormCheckbox
              label="Disponível"
              name="disponivel"
              checked={formData.disponivel}
              onChange={(e) => handleFieldChange('disponivel', e.target.checked)}
              helpText="Marque se este quarto está disponível para reserva"
            />
          </FormContainer>
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Lista de Quartos</h2>
          <DataTable
            columns={columns}
            data={quartos}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="Nenhum quarto encontrado. Crie um para começar."
          />
        </div>
      </div>
    </div>
  );
}
