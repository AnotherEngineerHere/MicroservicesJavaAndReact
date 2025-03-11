import { useState, useEffect } from 'react';
import { cartApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { CartItem, Product } from '../types';
import { useNavigate } from 'react-router-dom';

interface CartResponse {
  id: number;
  userId: number;
  items: {
    id: number;
    product: Product;
    quantity: number;
  }[];
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Cargar carrito al iniciar o cuando cambie el usuario
  const fetchCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const cartData: CartResponse = await cartApi.getCartByUserId(user.id);
      
      console.log('Carrito obtenido:', cartData);
      
      // Transformar la estructura del carrito
      const transformedCart: CartItem[] = cartData.items.map(item => ({
        productId: item.product.id.toString(),
        quantity: item.quantity,
        product: item.product
      }));

      setCart(transformedCart);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      toast.error('No se pudo cargar el carrito');
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar carrito al montar el componente o cambiar usuario
  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (item: { 
    productId: string; 
    quantity: number; 
    product: Product 
  }) => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const cartData: CartResponse = await cartApi.getCartByUserId(user.id);
      const response = await fetch(
        `http://localhost:9003/api/cart/${cartData.id}/add/${item.productId}?quantity=${item.quantity}`, 
        { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const updatedCart = await response.json();
      
      const transformedCart: CartItem[] = updatedCart.items.map((item: any) => ({
        productId: item.product.id.toString(),
        quantity: item.quantity,
        product: item.product
      }));

      setCart(transformedCart);
      
      toast.success('Producto agregado al carrito');
      window.location.reload();
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error('No se pudo agregar el producto');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const cartData: CartResponse = await cartApi.getCartByUserId(user.id);
      const response = await fetch(
        `http://localhost:9003/api/cart/${cartData.id}/remove/${productId}`, 
        { 
          method: 'DELETE',
        }
      );

      const updatedCart = await response.json();
      
      const transformedCart: CartItem[] = updatedCart.items.map((item: any) => ({
        productId: item.product.id.toString(),
        quantity: item.quantity,
        product: item.product
      }));

      setCart(transformedCart);
      
    } catch (error) {
      toast.success('Producto eliminado del carrito');
      console.error('Error al eliminar del carrito:', error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!user) return;

    // Prevenir cantidades negativas
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      
      // Usar el endpoint específico para actualizar cantidad
      const response = await fetch(
        `http://localhost:9002/api/cart/${user.id}/add/${productId}?quantity=${newQuantity}`, 
        { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const updatedCart = await response.json();
      
      // Transformar la estructura del carrito
      const transformedCart: CartItem[] = updatedCart.items.map((item: any) => ({
        productId: item.product.id.toString(),
        quantity: item.quantity,
        product: item.product
      }));

      setCart(transformedCart);
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      toast.error('No se pudo actualizar la cantidad');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const cartData: CartResponse = await cartApi.getCartByUserId(user.id);
      // Implementar lógica de crear orden según tu backend
      const response = await fetch(
        `http://localhost:9002/api/cart/${cartData.id}/checkout`, 
        { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const order = await response.json();

      // Limpiar carrito
      setCart([]);
      toast.success('Orden creada exitosamente');
      return order;
    } catch (error) {
      console.error('Error al crear la orden:', error);
      toast.error('No se pudo crear la orden');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    createOrder,
    fetchCart
  };
}