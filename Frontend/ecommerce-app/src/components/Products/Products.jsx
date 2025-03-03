import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  Container,
  Title,
  Table,
  Th,
  Td,
  Button,
  DeleteButton,
  FormWrapper,
  Input
} from './Products.styled';

/**
 * Products component that lists products, allows creation, deletion,
 * and modification via a SweetAlert modal.
 *
 * @component
 * @returns {JSX.Element} The rendered Products component.
 */
const Products = () => {
  const [products, setProducts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: ''
  });

  /**
   * Fetches the list of products from the API.
   *
   * @throws Will throw an error if fetching products fails.
   */
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:9001/api/products');
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      Swal.fire('Error', error.message, 'error');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Deletes a product by its ID using a SweetAlert confirmation modal.
   *
   * @param {number} id The ID of the product to delete.
   * @throws Will throw an error if deletion fails.
   */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar!'
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:9001/api/products/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error('Error al borrar el producto');
        }
        Swal.fire('Borrado!', 'El producto ha sido eliminado.', 'success');
        fetchProducts();
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  /**
   * Opens a SweetAlert modal to edit a product.
   *
   * @param {Object} product The product to edit.
   * @throws Will throw an error if update fails.
   */
  const handleEdit = async (product) => {
    const { value: formValues } = await Swal.fire({
      title: 'Modificar Producto',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${product.name}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Descripción" value="${product.description}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="URL de la imagen" value="${product.imageUrl}">` +
        `<input id="swal-input4" type="number" class="swal2-input" placeholder="Precio" value="${product.price}">`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: document.getElementById('swal-input1').value,
          description: document.getElementById('swal-input2').value,
          imageUrl: document.getElementById('swal-input3').value,
          price: parseFloat(document.getElementById('swal-input4').value)
        };
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    });

    if (formValues) {
      try {
        const response = await fetch(`http://localhost:9001/api/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar el producto');
        }
        Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
        fetchProducts();
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  /**
   * Handles the submission of the new product form.
   *
   * @param {React.FormEvent<HTMLFormElement>} e The form submission event.
   * @throws Will throw an error if product creation fails.
   */
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          imageUrl: newProduct.imageUrl,
          price: parseFloat(newProduct.price)
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el producto');
      }
      setNewProduct({ name: '', description: '', imageUrl: '', price: '' });
      setShowCreateForm(false);
      fetchProducts();
      Swal.fire('Éxito', 'Producto creado correctamente', 'success');
    } catch (error) {
      console.error('Error creating product:', error.message);
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <Container>
      <Title>Listado de Productos</Title>
      <Button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Cancelar' : 'Crear Nuevo Producto'}
      </Button>
      {showCreateForm && (
        <FormWrapper>
          <h3>Crear Producto</h3>
          <form onSubmit={handleCreate}>
            <Input
              type="text"
              placeholder="Nombre"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Descripción"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="URL de la imagen"
              value={newProduct.imageUrl}
              onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Precio"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
            <Button type="submit">Crear Producto</Button>
          </form>
        </FormWrapper>
      )}
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Descripción</Th>
            <Th>Imagen</Th>
            <Th>Precio</Th>
            <Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <Td>{product.id}</Td>
              <Td>{product.name}</Td>
              <Td>{product.description}</Td>
              <Td>{product.imageUrl}</Td>
              <Td>{product.price}</Td>
              <Td>
                <Button onClick={() => handleEdit(product)}>Modificar</Button>
                <DeleteButton onClick={() => handleDelete(product.id)}>
                  Borrar
                </DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Products;
