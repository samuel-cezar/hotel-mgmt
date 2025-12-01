import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../Common/DataTable';
import Alert from '../Common/Alert';
import { useList } from '../../hooks/useList';

function ClienteList() {
  const navigate = useNavigate();
  const {
    data: clientes,
    loading,
    successMessage,
    errorMessage,
    deleteItem,
    clearMessages,
  } = useList('/clientes');

  const handleEdit = (cliente) => {
    navigate('/clientes', { state: { editItem: cliente } });
  };

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
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No clients found."
        />
      </div>
    </div>
  );
}

export default ClienteList;
