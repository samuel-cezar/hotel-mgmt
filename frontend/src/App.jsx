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
import React from 'react';
import Home from './Components/Pages/Home';
import ClienteForm from './Components/Pages/ClienteForm';
import QuartoForm from './Components/Pages/QuartoForm';
import ReservaForm from './Components/Pages/ReservaForm';
import LoginForm from './Components/Pages/LoginForm';
import CategoriaForm from './Components/Pages/CategoriaForm';
import ReceitaForm from './Components/Pages/ReceitaForm';
import UsuarioForm from './Components/Pages/UsuarioForm';
import CategoriaList from './Components/Pages/CategoriaList';
import ReceitaList from './Components/Pages/ReceitaList';
import UsuarioList from './Components/Pages/UsuarioList';
import ReceitaListByCategoria from './Components/Pages/ReceitaListByCategoria';
import ClienteList from './Components/Pages/ClienteList';
import QuartoList from './Components/Pages/QuartoList';
import ReservaList from './Components/Pages/ReservaList';
import Menu from './Components/Layout/Menu';
import Rodape from './Components/Layout/Rodape';

function App() {
  return (
    <Router>
      <Menu />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/clientes" element={<ClienteForm />} />
          <Route path="/clientes/list" element={<ClienteList />} />
          <Route path="/quartos" element={<QuartoForm />} />
          <Route path="/quartos/list" element={<QuartoList />} />
          <Route path="/reservas" element={<ReservaForm />} />
          <Route path="/reservas/list" element={<ReservaList />} />
          <Route path="/categorias" element={<CategoriaForm />} />
          <Route path="/categorias/list" element={<CategoriaList />} />
          <Route path="/receitas" element={<ReceitaForm />} />
          <Route path="/receitas/list" element={<ReceitaList />} />
          <Route path="/receitas/categoria" element={<ReceitaListByCategoria />} />
          <Route path="/usuarios" element={<UsuarioForm />} />
          <Route path="/usuarios/list" element={<UsuarioList />} />
        </Routes>
      </main>
      <Rodape />
    </Router>
  );
}

export default App;
