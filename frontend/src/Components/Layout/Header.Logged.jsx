import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HeaderLogged() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Dispara evento personalizado para notificar componente App da mudança de autenticação
    window.dispatchEvent(new Event('authChange'));
    closeDrawer();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          🏨 Gerenciamento de Hotel
        </Link>

        <button
          className={`hamburger ${isDrawerOpen ? 'active' : ''}`.trim()}
          onClick={toggleDrawer}
          aria-label="Alternar menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className="navbar-nav">
          <li className="nav-group">
            <span className="nav-label">Clientes</span>
            <ul className="nav-sublist">
              <li><Link to="/clientes" className="nav-link">Novo Cliente</Link></li>
              <li><Link to="/clientes/list" className="nav-link">Ver Clientes</Link></li>
            </ul>
          </li>
          <li className="nav-group">
            <span className="nav-label">Quartos</span>
            <ul className="nav-sublist">
              <li><Link to="/quartos" className="nav-link">Novo Quarto</Link></li>
              <li><Link to="/quartos/list" className="nav-link">Ver Quartos</Link></li>
            </ul>
          </li>
          <li className="nav-group">
            <span className="nav-label">Reservas</span>
            <ul className="nav-sublist">
              <li><Link to="/reservas" className="nav-link">Nova Reserva</Link></li>
              <li><Link to="/reservas/list" className="nav-link">Ver Reservas</Link></li>
            </ul>
          </li>
          <li>
            <button onClick={handleLogout} className="nav-link nav-logout">
              Sair
            </button>
          </li>
        </ul>
      </nav>

      {/* Menu de Navegação Mobile */}
      <div className={`nav-drawer ${isDrawerOpen ? 'active' : ''}`.trim()} onClick={closeDrawer}>
        <div className="nav-drawer-content" onClick={(e) => e.stopPropagation()}>
          <div className="nav-drawer-header">
            <span className="nav-drawer-title">🏨 Menu</span>
            <button className="nav-drawer-close" onClick={closeDrawer} aria-label="Fechar menu">
              ✕
            </button>
          </div>
          <ul className="nav-drawer-nav">
            <li className="nav-group-mobile">
              <span className="nav-label">Clientes</span>
              <ul className="nav-sublist-mobile">
                <li><Link to="/clientes" className="nav-link" onClick={closeDrawer}>Novo Cliente</Link></li>
                <li><Link to="/clientes/list" className="nav-link" onClick={closeDrawer}>Ver Clientes</Link></li>
              </ul>
            </li>
            <li className="nav-group-mobile">
              <span className="nav-label">Quartos</span>
              <ul className="nav-sublist-mobile">
                <li><Link to="/quartos" className="nav-link" onClick={closeDrawer}>Novo Quarto</Link></li>
                <li><Link to="/quartos/list" className="nav-link" onClick={closeDrawer}>Ver Quartos</Link></li>
              </ul>
            </li>
            <li className="nav-group-mobile">
              <span className="nav-label">Reservas</span>
              <ul className="nav-sublist-mobile">
                <li><Link to="/reservas" className="nav-link" onClick={closeDrawer}>Nova Reserva</Link></li>
                <li><Link to="/reservas/list" className="nav-link" onClick={closeDrawer}>Ver Reservas</Link></li>
              </ul>
            </li>
            <li className="nav-drawer-logout">
              <button onClick={handleLogout} className="nav-logout-mobile">
                Sair
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default HeaderLogged;
