import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Button = styled.button`
  padding: 8px 12px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  background-color: #dc3545;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #c82333;
  }
`;

/**
 * LogoutButton component.
 *
 * @component
 * @returns {JSX.Element} The rendered logout button.
 */
const LogoutButton = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:9000/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
      if (response.ok) {
        localStorage.removeItem('access_token');
        navigate('/login');
        window.location.reload();
      } else {
        alert('Error al cerrar sesión');
      }
    } catch (error) {
      alert('Error al cerrar sesión: ' + error.message);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
