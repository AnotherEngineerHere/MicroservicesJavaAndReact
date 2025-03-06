import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../lib/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const [userData, setUserData] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    birthDate: ''
  });

  // Estado para manejar cambios
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: ''
  });

  // Cargar datos del usuario al abrir el modal
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          toast.error('No se encontró el correo del usuario');
          return;
        }

        const user = await userApi.getUserByEmail(email);
        
        // Formatear fecha de nacimiento
        const birthDate = user.birthDate 
          ? `${user.birthDate[0]}-${String(user.birthDate[1]).padStart(2, '0')}-${String(user.birthDate[2]).padStart(2, '0')}`
          : '';

        setUserData({
          ...user,
          birthDate
        });

        // Inicializar formData con los datos actuales
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address
        });
      } catch (error) {
        console.error('Error al obtener datos de usuario:', error);
        toast.error('No se pudo cargar la información del usuario');
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  // Validaciones
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error('El nombre es obligatorio');
      return false;
    }

    if (!formData.lastName.trim()) {
      toast.error('El apellido es obligatorio');
      return false;
    }

    if (!formData.address.trim()) {
      toast.error('La dirección es obligatoria');
      return false;
    }

    return true;
  };

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar actualización
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Preparar datos para actualización
      const updateData = {
        id: userData.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: userData.email,
        address: formData.address,
        birthDate: userData.birthDate
      };

      // Llamar al endpoint de actualización
      await userApi.updateUserProfile(updateData);

      // Cerrar sesión después de actualizar
      signOut();

      // Mostrar mensaje de éxito
      toast.success('Perfil actualizado. Por favor, inicie sesión nuevamente.');

      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('No se pudo actualizar el perfil');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Editar Perfil</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              value={userData.email}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <input
              type="date"
              value={userData.birthDate}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;