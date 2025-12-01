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
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
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
      <div className={`nav-drawer ${isDrawerOpen ? 'active' : ''}`.trim()}>
        <div className="nav-drawer-content">
          <ul className="nav-drawer-nav">
            <li>
              <Link to="/" className="nav-link" onClick={closeDrawer}>
                Home
              </Link>
            </li>
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
            <li>
              <button onClick={handleLogout} className="nav-link nav-logout" style={{ width: '100%', textAlign: 'left' }}>
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
