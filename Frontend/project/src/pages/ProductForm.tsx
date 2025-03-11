import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import toast from 'react-hot-toast';

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, createProduct, updateProduct } = useProducts();
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    imageUrl: '',
    stock: 0,
    description: ''
  });

  useEffect(() => {
    if (id) {
      const product = products.find(p => p.id === Number(id));
      if (product) {
        setFormData({
          name: product.name,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          description: product.description
        });
      }
    }
  }, [id, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones de campos obligatorios
    if (
      formData.name.trim() === '' ||
      formData.imageUrl.trim() === '' ||
      formData.description.trim() === ''
    ) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    // Validación para el precio (no negativo)
    if (formData.price < 0) {
      toast.error('El precio no puede ser negativo');
      return;
    }

    // Validación para el stock (no negativo)
    if (formData.stock < 0) {
      toast.error('El stock no puede ser negativo');
      return;
    }

    try {
      if (id) {
        await updateProduct(id, formData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await createProduct(formData);
        toast.success('Producto creado exitosamente');
      }
      navigate('/');
    } catch (error) {
      toast.error('No se pudo guardar el producto');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'price' || name === 'stock'
          ? parseFloat(value)
          : value
    }));
  };

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {id ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Precio
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              URL de la Imagen
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
            >
              {id ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
