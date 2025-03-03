// src/components/Register/Register.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RegisterWrapper, Form, Input, Button } from './Register.styled';

const Register = ({ onRegister }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const data = {
      firstName,
      lastName,
      address,
      email,
      birthDate,
      password,
    };

    try {
      const response = await fetch('http://localhost:9000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      const result = await response.json();
      console.log('Registro exitoso:', result);
      if (onRegister) {
        onRegister(result);
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error en el registro: ' + error.message);
    }
  };

  return (
    <RegisterWrapper>
      <h2>Registro</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Dirección"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="date"
          placeholder="Fecha de nacimiento"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit">Registrarse</Button>
      </Form>
    </RegisterWrapper>
  );
};

Register.propTypes = {
  onRegister: PropTypes.func,
};

Register.defaultProps = {
  onRegister: null,
};

export default Register;
