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
    { key: 'numero', label: 'Número do Quarto' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'preco', label: 'Preço' },
    { key: 'disponivel', label: 'Disponível', render: (value) => value ? 'Sim' : 'Não' },
  ];

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Quartos</h1>
          <p>Visualize e gerencie todos os quartos do hotel</p>
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
          emptyMessage="Nenhum quarto encontrado."
        />
      </div>
    </div>
  );
}

export default QuartoList;
