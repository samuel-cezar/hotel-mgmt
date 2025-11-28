import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from './Components/Pages/Home'
import ClienteForm from './Components/Pages/ClienteForm';
import QuartoForm from './Components/Pages/QuartoForm';
import ReservaForm from './Components/Pages/ReservaForm';
import LoginForm from './Components/Pages/LoginForm';
import Menu from './Components/Layout/Menu'
import Rodape from './Components/Layout/Rodape'

function App() {
  return (
    <>
    <Router>
      <Menu />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/clientes" element={<ClienteForm />} />
          <Route path="/quartos" element={<QuartoForm />} />
          <Route path="/reservas" element={<ReservaForm />} />
      </Routes>
      <Rodape />
    </Router>
    </>
  );
}

export default App;
