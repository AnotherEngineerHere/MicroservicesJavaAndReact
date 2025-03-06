import React, { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { Trash2, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Carrito: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, createOrder, loading, fetchCart } = useCart();
  const navigate = useNavigate();

  // Forzar recarga del carrito al montar el componente
  useEffect(() => {
    fetchCart();
  }, []);

  // Añadir un log para depuración
  useEffect(() => {
    console.log('Carrito actual:', cart);
  }, [cart]);

  // Manejar caso de carrito no cargado o vacío
  if (loading) {
    return (
      <div className="min-h-screen pt-16 px-4 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando carrito...</div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen pt-16 px-4">
        <div className="max-w-7xl mx-auto mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Ir a Comprar
          </button>
        </div>
      </div>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      await createOrder();
      toast.success('Pedido realizado con éxito');
      navigate('/');
    } catch (error) {
      toast.error('No se pudo realizar el pedido');
    }
  };

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-7xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Carrito de Compras</h2>
        <div className="space-y-4">
          {cart.map((item) => (
            <div 
              key={item.productId} 
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.imageUrl || 'https://via.placeholder.com/100x100?text=Sin+Imagen'}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                  <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                  {item.product.stock > 0 ? (
                    <p className="text-sm text-green-600">
                      En stock: {item.product.stock} disponibles
                    </p>
                  ) : (
                    <p className="text-sm text-red-600">Sin stock</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-between items-center">
          <div className="text-lg font-medium text-gray-900">
            Total: ${total.toFixed(2)}
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading || cart.some(item => item.quantity > item.product.stock)}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Finalizar Compra'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;