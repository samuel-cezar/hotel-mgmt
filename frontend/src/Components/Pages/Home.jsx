import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="page">
          <div className="page-header">
            <h1>Bem-vindo ao Sistema de Gerenciamento de Hotel</h1>
            <p>Gerencie suas operações de hotel de forma eficiente</p>
          </div>
          
          <div className="welcome-container">
            <div className="welcome-card">
              <h2>Bem-vindo!</h2>
              <p>Por favor, faça login para acessar o sistema de gerenciamento de hotel.</p>
              <Link to="/login" className="btn btn-primary btn-lg">
                Ir para o Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page">
        <div className="page-header">
          <h1>Painel de Controle</h1>
          <p>Gerencie suas operações de hotel</p>
        </div>

        <div className="dashboard-grid">
          {/* Clients Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>👥 Clientes</h3>
            </div>
            <p className="card-description">Gerencie e visualize todos os clientes</p>
            <div className="card-actions">
              <Link to="/clientes" className="btn btn-sm btn-secondary">
                Novo Cliente
              </Link>
              <Link to="/clientes/list" className="btn btn-sm btn-primary">
                Visualizar Todos
              </Link>
            </div>
          </div>

          {/* Rooms Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>🛏️ Quartos</h3>
            </div>
            <p className="card-description">Gerencie e visualize todos os quartos</p>
            <div className="card-actions">
              <Link to="/quartos" className="btn btn-sm btn-secondary">
                Novo Quarto
              </Link>
              <Link to="/quartos/list" className="btn btn-sm btn-primary">
                Visualizar Todos
              </Link>
            </div>
          </div>

          {/* Reservations Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📅 Reservas</h3>
            </div>
            <p className="card-description">Gerencie e visualize todas as reservas</p>
            <div className="card-actions">
              <Link to="/reservas" className="btn btn-sm btn-secondary">
                Nova Reserva
              </Link>
              <Link to="/reservas/list" className="btn btn-sm btn-primary">
                Visualizar Todos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 