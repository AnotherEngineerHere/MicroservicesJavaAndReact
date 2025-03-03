import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { LoginWrapper, Form, Input, Button } from './Login.styled';

/**
 * Login component for user authentication.
 *
 * @component
 * @param {Object} props Component properties.
 * @param {function} props.onLogin Callback invoked after successful login, receiving an object with user info and access token.
 * @returns {JSX.Element} The rendered Login component.
 */
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  /**
   * Fetch user information using the provided access token.
   *
   * @param {string} accessToken The access token for authorization.
   * @throws Will throw an error if fetching user info fails.
   */
  const fetchUserInfo = async (accessToken) => {
    const encodedEmail = encodeURIComponent(email);
    const response = await fetch(`http://localhost:9000/api/users/email/${encodedEmail}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener la información del usuario');
    }
    const data = await response.json();
    setUserInfo(data);
    setShowModal(true);
    if (onLogin) {
      onLogin({ user: data, access_token: accessToken });
    }
  };

  /**
   * Handles the login form submission.
   *
   * @param {React.FormEvent<HTMLFormElement>} e The form submission event.
   * @throws Will throw an error if login fails.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };
    try {
      const response = await fetch('http://localhost:9000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }
      const result = await response.json();
      localStorage.setItem('access_token', result.access_token);
      fetchUserInfo(result.access_token);
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.message);
    }
  };

  /**
   * Closes the modal and redirects to products.
   */
  const closeModal = () => {
    setShowModal(false);
    navigate('/products');
    window.location.reload();
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
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
            textAlign: 'center'
          }}>
            <h3>Información del Usuario</h3>
            {userInfo ? (
              <div>
                <p><strong>Nombre:</strong> {userInfo.firstName} {userInfo.lastName}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Dirección:</strong> {userInfo.address}</p>
                <p><strong>Fecha de Nacimiento:</strong> {userInfo.birthDate}</p>
              </div>
            ) : (
              <p>No se encontró información del usuario.</p>
            )}
            <button
              onClick={closeModal}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
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
