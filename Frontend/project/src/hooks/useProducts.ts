import { useState, useEffect } from 'react';
import { Product } from '../types';
import { productApi } from '../lib/api';
import toast from 'react-hot-toast';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getProducts();
      console.log("Productos completos:", response);
      console.log("Productos data:", response);
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const response = await productApi.createProduct(productData);
      console.log("Producto creado:", response);
      setProducts([...products, response]);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Omit<Product, 'id'>) => {
    try {
      const response = await productApi.updateProduct(id, productData);
      console.log("Producto actualizado:", response);
      setProducts(products.map(p => p.id === Number(id) ? response : p));
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    refreshProducts: fetchProducts
  };
}