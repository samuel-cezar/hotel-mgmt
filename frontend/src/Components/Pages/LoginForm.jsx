import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../Common/FormInput';
import FormContainer from '../Common/FormContainer';
import Alert from '../Common/Alert';

const LoginForm = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!login || !senha) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      const { token } = data;
      localStorage.setItem('token', token);
      setSuccessMessage('Login successful! Redirecting...');
      setLogin('');
      setSenha('');

      // Dispatch custom event to notify App component of auth change
      window.dispatchEvent(new Event('authChange'));

      // Redirect after delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container container-sm">
      <div className="page">
        <div className="page-header">
          <h1>Login</h1>
          <p>Digite suas credenciais para acessar o sistema</p>
        </div>

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            dismissible={false}
          />
        )}

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage('')}
            dismissible
          />
        )}

        <FormContainer
          singleColumn
          loading={loading}
          submitText="Login"
          onSubmit={handleSubmit}
        >
          <FormInput
            label="Login"
            name="login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="usuario@email.com"
            required
          />
          <FormInput
            label="Senha"
            name="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="*******"
            required
          />
        </FormContainer>
      </div>
    </div>
  );
};

export default LoginForm;
