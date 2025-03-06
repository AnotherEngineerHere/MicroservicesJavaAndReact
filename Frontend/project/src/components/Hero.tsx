import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <img
          className="w-full h-[600px] object-cover"
          src="https://images.unsplash.com/photo-1483721310020-03333e577078?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt="Fondo del Hero"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Ropa Deportiva Premium
        </h1>
        <p className="mt-6 text-xl text-white max-w-3xl">
          Descubre nuestra colección de ropa deportiva de alto rendimiento, diseñada para atletas y entusiastas del fitness.
        </p>
      </div>
    </div>
  );
};

export default Hero;
