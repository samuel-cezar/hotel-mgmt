import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../Common/DataTable';
import Alert from '../Common/Alert';
import { useList } from '../../hooks/useList';

function QuartoList() {
  const navigate = useNavigate();
  const {
    data: quartos,
    loading,
    successMessage,
    errorMessage,
    deleteItem,
    clearMessages,
  } = useList('/quartos');

  const handleEdit = (quarto) => {
    navigate('/quartos', { state: { editItem: quarto } });
  };

  const handleDelete = async (quarto) => {
    try {
      await deleteItem('/quartos', quarto.id);
      clearMessages();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'numero', label: 'Room Number' },
    { key: 'tipo', label: 'Type' },
    { key: 'preco', label: 'Price' },
    { key: 'disponivel', label: 'Available', render: (value) => value ? 'Yes' : 'No' },
  ];

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Rooms</h1>
          <p>View and manage all hotel rooms</p>
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
          data={quartos}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No rooms found."
        />
      </div>
    </div>
  );
}

export default QuartoList;
