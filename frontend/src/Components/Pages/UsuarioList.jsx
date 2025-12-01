import React from 'react';
import DataTable from '../Common/DataTable';
import Alert from '../Common/Alert';
import { useList } from '../../hooks/useList';

function UsuarioList() {
  const {
    data: usuarios,
    loading,
    successMessage,
    errorMessage,
    deleteItem,
    clearMessages,
  } = useList('/usuarios');

  const handleDelete = async (usuario) => {
    try {
      await deleteItem('/usuarios', usuario.id);
      clearMessages();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
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

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Users</h1>
          <p>View and manage all system users</p>
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

        <DataTable
          columns={columns}
          data={usuarios}
          loading={loading}
          onDelete={handleDelete}
          emptyMessage="No users found."
        />
      </div>
    </div>
  );
}

export default UsuarioList;
