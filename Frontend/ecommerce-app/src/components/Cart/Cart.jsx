import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  CartWrapper,
  Title,
  Table,
  Th,
  Td,
  Button,
  Input
} from './Cart.styled';

/**
 * Cart component to display and manage the shopping cart.
 *
 * @component
 * @returns {JSX.Element} The rendered Cart component.
 */
const Cart = () => {
  const [cartId, setCartId] = useState(null);
  const [carts, setCarts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [productIdToAdd, setProductIdToAdd] = useState('');
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  /**
   * Fetches all carts.
   *
   * @throws Will throw an error if fetching fails.
   */
  const fetchAllCarts = async () => {
    try {
      const response = await fetch('http://localhost:9002/api/cart/');
      if (!response.ok) {
        throw new Error('Error al obtener los carritos');
      }
      const data = await response.json();
      setCarts(data);
    } catch (error) {
      alert(error.message);
    }
  };

  /**
   * Fetches the cart items for the given cart ID.
   *
   * @param {number} id - The cart ID.
   * @throws Will throw an error if fetching fails.
   */
  const fetchCartItems = async (id) => {
    try {
      const response = await fetch(`http://localhost:9002/api/cart/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los productos del carrito');
      }
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      alert(error.message);
    }
  };

  /**
   * Creates a new cart.
   *
   * @throws Will throw an error if creation fails.
   */
  const createCart = async () => {
    try {
      const response = await fetch('http://localhost:9002/api/cart/', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Error al crear el carrito');
      }
      const data = await response.json();
      await fetchAllCarts();
      setCartId(data.id);
      fetchCartItems(data.id);
    } catch (error) {
      alert(error.message);
    }
  };

  /**
   * Handler for when a cart is selected from the dropdown.
   *
   * @param {Event} e - The change event.
   */
  const handleCartSelect = (e) => {
    const selectedId = e.target.value;
    setCartId(selectedId);
    fetchCartItems(selectedId);
  };

  /**
   * Adds a product to the cart.
   *
   * @throws Will throw an error if the addition fails.
   */
  const addProduct = async () => {
    if (!cartId) {
      alert('Debes seleccionar un carrito');
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:9002/api/cart/${cartId}/add/${productIdToAdd}?quantity=${quantityToAdd}`,
        { method: 'POST' }
      );
      if (!response.ok) {
        throw new Error('Error al agregar el producto al carrito');
      }
      await response.json();
      fetchCartItems(cartId);
      setProductIdToAdd('');
      setQuantityToAdd(1);
    } catch (error) {
      alert(error.message);
    }
  };

  /**
   * Removes a product from the cart.
   *
   * @param {number} productId - The ID of the product to remove.
   * @throws Will throw an error if the removal fails.
   */
  const removeProduct = async (productId) => {
    if (!cartId) {
      alert('Debes seleccionar un carrito');
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:9002/api/cart/${cartId}/remove/${productId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        throw new Error('Error al eliminar el producto del carrito');
      }
      fetchCartItems(cartId);
    } catch (error) {
      alert(error.message);
    }
  };

  /**
   * Checks out the cart (creates an order), clears the cart, and shows a SweetAlert.
   *
   * @throws Will throw an error if the checkout fails.
   */
  const checkoutOrder = async () => {
    if (!cartId) {
      alert('Debes seleccionar un carrito');
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:9002/api/cart/${cartId}/checkout`,
        { method: 'POST' }
      );
      if (!response.ok) {
        throw new Error('Error al realizar el checkout');
      }
      await response.json();
      // Clear the cart items and current cart ID
      setCartItems([]);
      setCartId(null);
      Swal.fire({
        title: 'Orden creada',
        text: 'Tu pedido ha sido procesado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Cerrar'
      });
      // Reload carts list to update
      fetchAllCarts();
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchAllCarts();
  }, []);

  return (
    <CartWrapper>
      <Title>Carrito de Compras</Title>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="cartSelect">Selecciona un Carrito:</label>
        <select
          id="cartSelect"
          value={cartId || ''}
          onChange={handleCartSelect}
          style={{ marginLeft: '10px' }}
        >
          <option value="" disabled>
            -- Selecciona --
          </option>
          {carts.map((cart) => (
            <option key={cart.id} value={cart.id}>
              Carrito {cart.id}
            </option>
          ))}
        </select>
        <Button onClick={createCart} style={{ marginLeft: '10px' }}>
          Crear Carrito
        </Button>
      </div>
      <div>
        <h3>Añadir Producto</h3>
        <Input
          type="number"
          placeholder="ID del producto"
          value={productIdToAdd}
          onChange={(e) => setProductIdToAdd(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Cantidad"
          value={quantityToAdd}
          onChange={(e) => setQuantityToAdd(e.target.value)}
        />
        <Button onClick={addProduct}>Agregar Producto</Button>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Producto</Th>
            <Th>Descripción</Th>
            <Th>Precio</Th>
            <Th>Cantidad</Th>
            <Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <Td>{item.product.id}</Td>
              <Td>{item.product.name}</Td>
              <Td>{item.product.description}</Td>
              <Td>{item.product.price}</Td>
              <Td>{item.quantity}</Td>
              <Td>
                <Button onClick={() => removeProduct(item.product.id)}>
                  Borrar
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ marginTop: '20px' }}>
        <Button onClick={checkoutOrder}>Guardar Pedido</Button>
      </div>
    </CartWrapper>
  );
};

export default Cart;
