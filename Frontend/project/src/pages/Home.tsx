import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ProductCard';
import ProductCreateCard from '../components/ProductCreateCard';
import Hero from '../components/Hero';

const Home: React.FC = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart({ productId: product.id.toString(), quantity: 1, product })}
            />
          ))}
          <ProductCreateCard />
        </div>
      </div>
    </div>
  );
};

export default Home;