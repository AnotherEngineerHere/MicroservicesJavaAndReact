// src/components/Login/Login.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LoginWrapper, Form, Input, Button } from './Login.styled';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const data = { email, password };

    try {
      const response = await fetch('http://localhost:9000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const result = await response.json();
      console.log('Inicio de sesión exitoso:', result);
      if (onLogin) {
        onLogin(result);
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <LoginWrapper>
      <h2>Iniciar Sesión</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Ingresar</Button>
      </Form>
    </LoginWrapper>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func,
};

Login.defaultProps = {
  onLogin: null,
};

export default Login;
