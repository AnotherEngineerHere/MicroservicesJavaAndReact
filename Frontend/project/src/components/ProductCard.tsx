import React from 'react';
import { ShoppingCart, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { productApi } from '../lib/api';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductDeleted?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onProductDeleted 
}) => {
  const { user } = useAuth();
  const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg';
  const token = localStorage.getItem('token');

  function getImage(image: string): string | undefined {
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
        
      }finally{
        toast.success('Producto eliminado exitosamente');
        window.location.reload();
      }

    }
  };
  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={getImage(product.imageUrl)}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage;
          }}
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-sm font-medium text-gray-900">${product.price}</p>
          <p className="text-xs text-gray-500">Stock: {product.stock}</p>
        </div>
        <div className="flex items-center space-x-2">
          {token && (
            <>
              <Link
                to={`/product/${product.id}/edit`}
                className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                title="Modificar producto"
              >
                <Pencil size={16} />
              </Link>
              <button
                onClick={handleDeleteProduct}
                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                title="Eliminar producto"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          <button
            onClick={() => onAddToCart(product)}
            className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;