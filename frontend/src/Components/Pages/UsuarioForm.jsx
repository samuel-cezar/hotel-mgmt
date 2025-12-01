import React, { useState, useEffect } from 'react';
import FormInput from '../Common/FormInput';
import FormSelect from '../Common/FormSelect';
import FormContainer from '../Common/FormContainer';
import Alert from '../Common/Alert';
import DataTable from '../Common/DataTable';
import { useCrudForm } from '../../hooks/useCrudForm';

const UsuarioForm = () => {
  const [usuarios, setUsuarios] = useState([]);
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
    login: '',
    senha: '',
    tipo: '',
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const data = await fetchData('/usuarios');
      setUsuarios(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.login || !formData.senha || !formData.tipo) {
      return;
    }

    try {
      if (editingId) {
        await updateData(`/usuarios/${editingId}`, formData);
      } else {
        await createData('/usuarios', formData);
      }
      resetForm();
      setEditingId(null);
      loadUsuarios();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (usuario) => {
    setEditingId(usuario.id);
    Object.keys(usuario).forEach((key) => {
      if (key in formData) {
        handleFieldChange(key, usuario[key]);
      }
    });
  };

  const handleDelete = async (usuario) => {
    try {
      await deleteData(`/usuarios/${usuario.id}`);
      loadUsuarios();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingId(null);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'login', label: 'Username' },
    {
      key: 'tipo',
      label: 'Type',
      render: (value) => {
        const typeMap = { 1: 'Admin', 2: 'Manager', 3: 'User' };
        return typeMap[value] || `Type ${value}`;
      },
    },
  ];

  const tipoOptions = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Manager' },
    { value: 3, label: 'User' },
  ];

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>User Management</h1>
          <p>Create and manage system users</p>
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
            title={editingId ? 'Edit User' : 'New User'}
            singleColumn
            loading={loading}
            submitText={editingId ? 'Update User' : 'Create User'}
            onSubmit={handleSubmit}
            cancelButton={editingId}
            onCancel={handleCancel}
          >
            <FormInput
              label="Username"
              name="login"
              type="text"
              value={formData.login}
              onChange={(e) => handleFieldChange('login', e.target.value)}
              placeholder="Enter username"
              helpText="Unique login for system access"
              required
            />
            <FormInput
              label="Password"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={(e) => handleFieldChange('senha', e.target.value)}
              placeholder="Enter password"
              helpText="Secure password for the account"
              required
            />
            <FormSelect
              label="User Type"
              name="tipo"
              value={formData.tipo}
              onChange={(e) => handleFieldChange('tipo', e.target.value)}
              options={tipoOptions}
              placeholder="Select user type"
              required
            />
          </FormContainer>
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Users List</h2>
          <DataTable
            columns={columns}
            data={usuarios}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No users found. Create one to get started."
          />
        </div>
      </div>
    </div>
  );
};

export default UsuarioForm;
