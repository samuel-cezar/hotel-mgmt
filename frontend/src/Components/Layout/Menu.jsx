import React, { useState, useEffect } from 'react';
import Header from './Header';
import HeaderLogged from './Header.Logged';

function Menu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Listen for storage changes to update when logged out from another tab
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      setIsLoggedIn(!!newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return isLoggedIn ? <HeaderLogged /> : <Header />;
}

export default Menu;
