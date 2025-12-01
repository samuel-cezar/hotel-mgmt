import React from 'react';
import DataTable from '../Common/DataTable';
import Alert from '../Common/Alert';
import { useList } from '../../hooks/useList';

function ReservaList() {
  const {
    data: reservas,
    loading,
    successMessage,
    errorMessage,
    deleteItem,
    clearMessages,
  } = useList('/reservas');

  const handleDelete = async (reserva) => {
    try {
      await deleteItem('/reservas', reserva.id);
      clearMessages();
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'cliente_id', label: 'Client ID' },
    { key: 'quarto_id', label: 'Room ID' },
    { key: 'data_entrada', label: 'Check-in Date' },
    { key: 'data_saida', label: 'Check-out Date' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Reservations</h1>
          <p>View and manage all hotel reservations</p>
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
          data={reservas}
          loading={loading}
          onDelete={handleDelete}
          emptyMessage="No reservations found."
        />
      </div>
    </div>
  );
}

export default ReservaList;
