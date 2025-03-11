import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';
import { userApi } from '../lib/api';
import EditProfileModal from './EditProfile';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const handleViewProfile = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        toast.error('No se encontró el correo del usuario');
        return;
      }

      const userData = await userApi.getUserByEmail(email);
      
      const birthDate = userData.birthDate 
        ? new Date(userData.birthDate[0], userData.birthDate[1] - 1, userData.birthDate[2]).toLocaleDateString() 
        : 'No especificada';

      // Mostrar información en un toast
      toast(
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Información de Usuario</h2>
          <p><strong>Nombre:</strong> {userData.firstName} {userData.lastName}</p>
          <p><strong>Correo:</strong> {userData.email}</p>
          <p><strong>Dirección:</strong> {userData.address}</p>
          <p><strong>Fecha de Nacimiento:</strong> {birthDate}</p>
        </div>,
        {
          duration: 5000,
          style: {
            maxWidth: 400,
            padding: '16px',
            backgroundColor: '#f0f0f0',
          }
        }
      );

      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error al obtener información de usuario:', error);
      toast.error('No se pudo obtener la información del usuario');
    }
  };

  // Cerrar dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const token = localStorage.getItem('token');

  return (
    <>
      <nav className="fixed top-0 w-full bg-white z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Tienda Deportiva</h1>
            </Link>

            <div className="flex items-center space-x-4">
              {token ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <User size={20} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <button
                        onClick={handleViewProfile}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User size={16} className="mr-2" />
                        Ver Perfil
                      </button>
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings size={16} className="mr-2" />
                        Editar Perfil
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : null}

              {token ? (
                <Link to="/cart" className="text-gray-900 hover:text-gray-500 relative">
                  <ShoppingCart size={20} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;