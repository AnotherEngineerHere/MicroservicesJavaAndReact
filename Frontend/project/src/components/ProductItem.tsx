import React from 'react';
import { ShoppingCart, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { productApi } from '../lib/api';
import toast from 'react-hot-toast';

interface ProductItemProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductDeleted?: (id: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onAddToCart, onProductDeleted }) => {
  const { user } = useAuth();
  const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg';
  const token = localStorage.getItem('token');

  function getImage(image: string): string {
    return image ? image : placeholderImage;
  }

  const handleDeleteProduct = async () => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar el producto "${product.name}"?`);
    if (confirmDelete) {
      try {
        await productApi.deleteProduct(product.id.toString());
        toast.success('Producto eliminado exitosamente');
        if (onProductDeleted) {
          onProductDeleted(product.id);
        }
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        toast.error('Error al eliminar el producto');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center border p-6 rounded-lg shadow-lg bg-white">
      <div className="w-full md:w-1/3">
        <img
          src={getImage(product.imageUrl)}
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage;
          }}
        />
      </div>
      <div className="w-full md:w-2/3 mt-4 md:mt-0 md:pl-8">
        <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
        <p className="mt-2 text-2xl text-gray-700 font-medium">{product.description}</p>
        <p className="mt-2 text-2xl text-gray-700 font-medium">${product.price}</p>
        <p className="mt-1 text-lg text-gray-500">Stock: {product.stock}</p>
       
      </div>
    </div>
  );
};

export default ProductItem;
