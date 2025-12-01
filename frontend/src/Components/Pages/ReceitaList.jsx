import React from 'react';
import DataTable from '../Common/DataTable';
import Alert from '../Common/Alert';
import { useList } from '../../hooks/useList';

function ReceitaList() {
  const {
    data: receitas,
    loading,
    successMessage,
    errorMessage,
    deleteItem,
    clearMessages,
  } = useList('/receitas');

  const handleDelete = async (receita) => {
    try {
      await deleteItem('/receitas', receita.id);
      clearMessages();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Name' },
    {
      key: 'ingredientes',
      label: 'Ingredients',
      render: (value) => value.substring(0, 40) + (value.length > 40 ? '...' : ''),
    },
    {
      key: 'preparo',
      label: 'Instructions',
      render: (value) => value.substring(0, 40) + (value.length > 40 ? '...' : ''),
    },
  ];

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Recipes</h1>
          <p>View and manage all cooking recipes</p>
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
          data={receitas}
          loading={loading}
          onDelete={handleDelete}
          emptyMessage="No recipes found."
        />
      </div>
    </div>
  );
}

export default ReceitaList;
