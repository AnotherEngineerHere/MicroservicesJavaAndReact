import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';

const HomeRedirect: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Redirige a Home si hay un token
    } else {
      navigate('/login'); // Redirige a Login si no hay token
    }
  }, [navigate]);

  // Si hay un usuario, renderiza Home, de lo contrario renderiza Login
  const token = localStorage.getItem('token');
  return token ? <Home /> : <Login />;
};

export default HomeRedirect;