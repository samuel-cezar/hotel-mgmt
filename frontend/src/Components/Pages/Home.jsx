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
            <h1>Welcome to Hotel Management System</h1>
            <p>Manage your hotel operations efficiently</p>
          </div>
          
          <div className="welcome-container">
            <div className="welcome-card">
              <h2>Welcome!</h2>
              <p>Please log in to access the hotel management system.</p>
              <Link to="/login" className="btn btn-primary btn-lg">
                Go to Login
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
          <h1>Dashboard</h1>
          <p>Manage your hotel operations</p>
        </div>

        <div className="dashboard-grid">
          {/* Clients Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>👥 Clients</h3>
            </div>
            <p className="card-description">Manage and view all clients</p>
            <div className="card-actions">
              <Link to="/clientes" className="btn btn-sm btn-secondary">
                New Client
              </Link>
              <Link to="/clientes/list" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
          </div>

          {/* Rooms Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>🛏️ Rooms</h3>
            </div>
            <p className="card-description">Manage hotel rooms and availability</p>
            <div className="card-actions">
              <Link to="/quartos" className="btn btn-sm btn-secondary">
                New Room
              </Link>
              <Link to="/quartos/list" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
          </div>

          {/* Reservations Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📅 Reservations</h3>
            </div>
            <p className="card-description">Manage reservations and bookings</p>
            <div className="card-actions">
              <Link to="/reservas" className="btn btn-sm btn-secondary">
                New Reservation
              </Link>
              <Link to="/reservas/list" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
          </div>

          {/* Categories Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📂 Categories</h3>
            </div>
            <p className="card-description">Manage recipe categories</p>
            <div className="card-actions">
              <Link to="/categorias" className="btn btn-sm btn-secondary">
                New Category
              </Link>
              <Link to="/categorias/list" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
          </div>

          {/* Recipes Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>🍳 Recipes</h3>
            </div>
            <p className="card-description">Manage kitchen recipes</p>
            <div className="card-actions">
              <Link to="/receitas" className="btn btn-sm btn-secondary">
                New Recipe
              </Link>
              <Link to="/receitas/list" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
          </div>

          {/* Users Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>👨‍💼 Users</h3>
            </div>
            <p className="card-description">Manage system users and permissions</p>
            <div className="card-actions">
              <Link to="/usuarios" className="btn btn-sm btn-secondary">
                New User
              </Link>
              <Link to="/usuarios/list" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 