import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { cartApi, userApi } from '../lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  cart: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    firstName: string,
    lastName: string,
    address: string,
    email: string,
    birthDate: string,
    password: string
  ) => Promise<void>;
  signOut: () => void;
  updateProfile: (data: {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
  }) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<any | null>(null);

  // Cargar perfil de usuario usando el email y token almacenados
  const fetchUserProfile = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const token = localStorage.getItem('token');
      if (email && token) {
        const userData = await userApi.getUserByEmail(email);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error al cargar perfil de usuario:', error);
      signOut();
    }
  };

  // Al montar el componente, se intenta cargar el perfil
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const signUp = async (
    firstName: string, 
    lastName: string, 
    address: string, 
    email: string, 
    birthDate: string, 
    password: string
  ) => {
    const userData = { email, password, firstName, lastName, birthDate, address };
    try {
      const response = await userApi.register(userData);
      console.log('Registro exitoso:', response);
      // Inicia sesión automáticamente después del registro
      //await signIn(email, password);
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loginResponse = await userApi.login({ email, password });
      localStorage.setItem('token', loginResponse.access_token);
      localStorage.setItem('userEmail', email);

      const userData = await userApi.getUserByEmail(email);
      setUser(userData);

      const cartData = await cartApi.getCartByUserId(String(userData.id));
      setCart(cartData);
      window.location.reload();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUser(null);
    setCart(null);
    toast.success('Sesión cerrada');
  };

  const updateProfile = async (data: {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
  }) => {
    setLoading(true);
    try {
      const email = localStorage.getItem('userEmail');
      const fullUserData = {
        ...data,
        email: email || '', // Usa el email almacenado
        birthDate: user?.birthDate || '' // Conserva la fecha de nacimiento existente
      };
      await userApi.updateUserProfile(fullUserData);
      // Cierra la sesión para que el usuario inicie nuevamente
      signOut();
      toast.success('Perfil actualizado. Por favor, inicie sesión nuevamente.');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('No se pudo actualizar el perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      cart,
      signIn, 
      signUp, 
      signOut, 
      updateProfile,
      fetchUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
