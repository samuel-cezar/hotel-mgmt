import { useState, useEffect } from 'react';
import FormInput from '../Common/FormInput';
import FormContainer from '../Common/FormContainer';
import Alert from '../Common/Alert';
import DataTable from '../Common/DataTable';
import Button from '../Common/Button';
import { useCrudForm } from '../../hooks/useCrudForm';

export default function ClienteForm() {
  const [clientes, setClientes] = useState([]);
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
          >
            <FormInput
              label="Name"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => handleFieldChange('nome', e.target.value)}
              placeholder="Enter client name"
              helpText="Full name of the client"
              required
            />
            <FormInput
              label="CPF"
              name="cpf"
              type="text"
              value={formData.cpf}
              onChange={(e) => handleFieldChange('cpf', e.target.value)}
              placeholder="Enter CPF"
              helpText="Brazilian tax ID"
              required
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="Enter email address"
              helpText="Valid email address"
              required
            />
            <FormInput
              label="Phone"
              name="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleFieldChange('telefone', e.target.value)}
              placeholder="Enter phone number"
              helpText="Contact phone number"
              required
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
