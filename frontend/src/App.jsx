import './Assets/Styles/variables.css';
import './Assets/Styles/inputs.css';
import './Assets/Styles/forms.css';
import './Assets/Styles/buttons.css';
import './Assets/Styles/tables.css';
import './Assets/Styles/layout.css';
import './Assets/Styles/responsive.css';
import './Assets/Styles/home.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './Components/Pages/Home';
import ClienteForm from './Components/Pages/ClienteForm';
import QuartoForm from './Components/Pages/QuartoForm';
import ReservaForm from './Components/Pages/ReservaForm';
import LoginForm from './Components/Pages/LoginForm';
import ClienteList from './Components/Pages/ClienteList';
import QuartoList from './Components/Pages/QuartoList';
import ReservaList from './Components/Pages/ReservaList';
import Menu from './Components/Layout/Menu';
import Rodape from './Components/Layout/Rodape';
import ProtectedRoute from './Components/Common/ProtectedRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const handleAuthChange = () => {
      const newToken = localStorage.getItem('token');
      setIsLoggedIn(!!newToken);
    };

    // Listen for storage changes (cross-tab) and custom authChange event (same-tab)
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return (
    <Router>
      {isLoggedIn && <Menu />}
      <main>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <ClienteForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/list"
            element={
              <ProtectedRoute>
                <ClienteList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quartos"
            element={
              <ProtectedRoute>
                <QuartoForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quartos/list"
            element={
              <ProtectedRoute>
                <QuartoList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas"
            element={
              <ProtectedRoute>
                <ReservaForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas/list"
            element={
              <ProtectedRoute>
                <ReservaList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {isLoggedIn && <Rodape />}
    </Router>
  );
}

export default App;
