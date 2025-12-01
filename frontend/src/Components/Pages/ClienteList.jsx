import React from 'react';
import DataTable from '../Common/DataTable';
import Alert from '../Common/Alert';
import { useList } from '../../hooks/useList';

function ClienteList() {
  const {
    data: clientes,
    loading,
    successMessage,
    errorMessage,
    deleteItem,
    clearMessages,
  } = useList('/clientes');

  const handleDelete = async (cliente) => {
    try {
      await deleteItem('/clientes', cliente.id);
      clearMessages();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'telefone', label: 'Phone' },
    { key: 'endereco', label: 'Address' },
  ];

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Clients</h1>
          <p>View and manage all system clients</p>
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
          data={clientes}
          loading={loading}
          onDelete={handleDelete}
          emptyMessage="No clients found."
        />
      </div>
    </div>
  );
}

export default ClienteList;
