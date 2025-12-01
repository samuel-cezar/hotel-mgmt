import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
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
          <li>
            <Link to="/login" className="nav-link">Login</Link>
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
            <li>
              <Link to="/login" className="nav-link" onClick={closeDrawer}>
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;
