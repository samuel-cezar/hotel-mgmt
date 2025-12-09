import React from 'react';
import { Link } from 'react-router-dom';
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (value, reserva) =>
        reserva.cliente ? (
          <Link
            to="/clientes"
            state={{ editItem: reserva.cliente }}
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-dark)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
          >
            {reserva.cliente.nome}
          </Link>
        ) : `ID: ${reserva.clienteId}`
    },
    {
      key: 'quarto',
      label: 'Quarto',
      render: (value, reserva) =>
        reserva.quarto ? (
          <Link
            to="/quartos"
            state={{ editItem: reserva.quarto }}
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-dark)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
          >
            {reserva.quarto.numero} ({reserva.quarto.tipo})
          </Link>
        ) : `ID: ${reserva.quartoId}`
    },
    {
      key: 'data_entrada',
      label: 'Check-in',
      render: (value) => formatDate(value)
    },
    {
      key: 'data_saida',
      label: 'Check-out',
      render: (value) => formatDate(value)
    },
    {
      key: 'valor_total',
      label: 'Total',
      render: (value, reserva) => reserva.valor_total
        ? `R$ ${parseFloat(reserva.valor_total).toFixed(2)}`
        : '-'
    },
  ];

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Reservas</h1>
          <p>Visualize e gerencie todas as reservas do hotel</p>
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
          emptyMessage="Nenhuma reserva encontrada."
        />
      </div>
    </div>
  );
}

export default ReservaList;
