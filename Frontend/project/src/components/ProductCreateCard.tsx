import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProductCreateCard: React.FC = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  // Solo mostrar si hay un usuario autenticado
  if (!token) return null;

  return (
    <div className="group relative border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-black transition-colors">
      <Link 
        to="/product/new" 
        className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
      >
        <div className="bg-gray-100 rounded-full p-3 mb-4 group-hover:bg-black group-hover:text-white transition-colors">
          <Plus size={32} className="text-gray-600 group-hover:text-white" />
        </div>
        <h3 className="text-sm text-gray-700 group-hover:text-black">
          Crear Nuevo Producto
        </h3>
        <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-700">
          Añade un producto a tu catálogo
        </p>
        <div className="mt-2 text-xs text-gray-500 group-hover:text-gray-700">
          Stock: 0
        </div>
      </Link>
    </div>
  );
};

export default ProductCreateCard;