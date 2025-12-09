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
    // Dispatch custom event to notify App component of auth change
    window.dispatchEvent(new Event('authChange'));
    closeDrawer();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          🏨 Hotel Management
        </Link>
        
        <button 
          className={`hamburger ${isDrawerOpen ? 'active' : ''}`.trim()}
          onClick={toggleDrawer}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className="navbar-nav">
          <li className="nav-group">
            <span className="nav-label">Clients</span>
            <ul className="nav-sublist">
              <li><Link to="/clientes" className="nav-link">New Client</Link></li>
              <li><Link to="/clientes/list" className="nav-link">View Clients</Link></li>
            </ul>
          </li>
          <li className="nav-group">
            <span className="nav-label">Rooms</span>
            <ul className="nav-sublist">
              <li><Link to="/quartos" className="nav-link">New Room</Link></li>
              <li><Link to="/quartos/list" className="nav-link">View Rooms</Link></li>
            </ul>
          </li>
          <li className="nav-group">
            <span className="nav-label">Reservations</span>
            <ul className="nav-sublist">
              <li><Link to="/reservas" className="nav-link">New Reservation</Link></li>
              <li><Link to="/reservas/list" className="nav-link">View Reservations</Link></li>
            </ul>
          </li>
          <li>
            <button onClick={handleLogout} className="nav-link nav-logout">
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div className={`nav-drawer ${isDrawerOpen ? 'active' : ''}`.trim()} onClick={closeDrawer}>
        <div className="nav-drawer-content" onClick={(e) => e.stopPropagation()}>
          <div className="nav-drawer-header">
            <span className="nav-drawer-title">🏨 Menu</span>
            <button className="nav-drawer-close" onClick={closeDrawer} aria-label="Close menu">
              ✕
            </button>
          </div>
          <ul className="nav-drawer-nav">
            <li className="nav-group-mobile">
              <span className="nav-label">Clients</span>
              <ul className="nav-sublist-mobile">
                <li><Link to="/clientes" className="nav-link" onClick={closeDrawer}>New Client</Link></li>
                <li><Link to="/clientes/list" className="nav-link" onClick={closeDrawer}>View Clients</Link></li>
              </ul>
            </li>
            <li className="nav-group-mobile">
              <span className="nav-label">Rooms</span>
              <ul className="nav-sublist-mobile">
                <li><Link to="/quartos" className="nav-link" onClick={closeDrawer}>New Room</Link></li>
                <li><Link to="/quartos/list" className="nav-link" onClick={closeDrawer}>View Rooms</Link></li>
              </ul>
            </li>
            <li className="nav-group-mobile">
              <span className="nav-label">Reservations</span>
              <ul className="nav-sublist-mobile">
                <li><Link to="/reservas" className="nav-link" onClick={closeDrawer}>New Reservation</Link></li>
                <li><Link to="/reservas/list" className="nav-link" onClick={closeDrawer}>View Reservations</Link></li>
              </ul>
            </li>
            <li className="nav-drawer-logout">
              <button onClick={handleLogout} className="nav-logout-mobile">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default HeaderLogged;
