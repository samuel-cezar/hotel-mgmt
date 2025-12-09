import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FormInput from '../Common/FormInput';
import FormContainer from '../Common/FormContainer';
import Alert from '../Common/Alert';
import DataTable from '../Common/DataTable';
import Button from '../Common/Button';
import { useCrudForm } from '../../hooks/useCrudForm';

// Mask utility functions
const maskCPF = (value) => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');

  // Limit to 11 digits
  const limited = numbers.substring(0, 11);

  // Apply CPF mask: XXX.XXX.XXX-XX
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  } else if (limited.length <= 9) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  } else {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  }
};

const maskPhone = (value) => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');

  // Limit to 11 digits (2 for area code + 9 for number)
  const limited = numbers.substring(0, 11);

  // Apply phone mask: (XX) XXXXX-XXXX
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 7) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
};

// Validation functions
const validateCPF = (cpf) => {
  const numbers = cpf.replace(/\D/g, '');
  return numbers.length === 11;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const numbers = phone.replace(/\D/g, '');
  return numbers.length === 11;
};

const validateName = (name) => {
  return name.trim().length > 0;
};

export default function ClienteForm() {
  const location = useLocation();
  const [clientes, setClientes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [touched, setTouched] = useState({
    nome: false,
    cpf: false,
    email: false,
    telefone: false,
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
    getToken,
  } = useCrudForm({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
  });

  useEffect(() => {
    loadClientes();
  }, []);

  // Handle navigation from ClienteList with edit item
  useEffect(() => {
    if (location.state?.editItem) {
      const cliente = location.state.editItem;
      handleEdit(cliente);
      // Clear the state to avoid re-triggering on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadClientes = async () => {
    try {
      const data = await fetchData('/clientes');
      setClientes(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.cpf || !formData.email || !formData.telefone) {
      return;
    }

    try {
      if (editingId) {
        await updateData(`/clientes/${editingId}`, formData);
      } else {
        await createData('/clientes', formData);
      }
      resetForm();
      setEditingId(null);
      loadClientes();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleEdit = (cliente) => {
    setEditingId(cliente.id);
    Object.keys(cliente).forEach((key) => {
      if (key in formData) {
        handleFieldChange(key, cliente[key]);
      }
    });
  };

  const handleDelete = async (cliente) => {
    try {
      await deleteData(`/clientes/${cliente.id}`);
      loadClientes();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingId(null);
    setTouched({
      nome: false,
      cpf: false,
      email: false,
      telefone: false,
    });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      validateName(formData.nome) &&
      validateCPF(formData.cpf) &&
      validateEmail(formData.email) &&
      validatePhone(formData.telefone)
    );
  };

  // Get field validation class
  const getFieldClass = (field, validator) => {
    if (!touched[field]) return '';
    return validator(formData[field]) ? 'input-success' : 'input-error';
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Name' },
    { key: 'cpf', label: 'CPF' },
    { key: 'email', label: 'Email' },
    { key: 'telefone', label: 'Phone' },
  ];

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Client Management</h1>
          <p>Create, edit, and manage system clients</p>
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
            title={editingId ? 'Edit Client' : 'New Client'}
            loading={loading}
            submitText={editingId ? 'Update Client' : 'Create Client'}
            onSubmit={handleSubmit}
            cancelButton={editingId}
            onCancel={handleCancel}
            disabled={!isFormValid()}
          >
            <FormInput
              label="Name"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => handleFieldChange('nome', e.target.value)}
              onBlur={() => handleBlur('nome')}
              placeholder="Enter client name"
              helpText="Full name of the client"
              required
              className={getFieldClass('nome', validateName)}
            />
            <FormInput
              label="CPF"
              name="cpf"
              type="text"
              value={formData.cpf}
              onChange={(e) => handleFieldChange('cpf', maskCPF(e.target.value))}
              onBlur={() => handleBlur('cpf')}
              placeholder="000.000.000-00"
              helpText="Brazilian tax ID (format: XXX.XXX.XXX-XX)"
              required
              maxLength="14"
              className={getFieldClass('cpf', validateCPF)}
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Enter email address"
              helpText="Valid email address"
              required
              className={getFieldClass('email', validateEmail)}
            />
            <FormInput
              label="Phone"
              name="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleFieldChange('telefone', maskPhone(e.target.value))}
              onBlur={() => handleBlur('telefone')}
              placeholder="(00) 00000-0000"
              helpText="Contact phone number (format: (XX) XXXXX-XXXX)"
              required
              maxLength="15"
              className={getFieldClass('telefone', validatePhone)}
            />
          </FormContainer>
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Clients List</h2>
          <DataTable
            columns={columns}
            data={clientes}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No clients found. Create one to get started."
          />
        </div>
      </div>
    </div>
  );
}
