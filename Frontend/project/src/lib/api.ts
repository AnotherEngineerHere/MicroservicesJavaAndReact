const API_URL = 'http://localhost:9003';

interface HttpClientOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  baseUrl?: string;
}

/**
 * Wrapper para realizar peticiones HTTP usando fetch.
 * @param {string} url - La URL relativa a la base.
 * @param {HttpClientOptions} options - Opciones de la petición.
 * @returns {Promise<any>} - La respuesta parseada en JSON.
 */
const httpClient = async (url: string, { method = 'GET', body, headers = {}, baseUrl }: HttpClientOptions = {}): Promise<any> => {
  // Si la URL no corresponde a /auth/login, agrega el token
  if (!url.includes('/auth/login')) {
    const token = localStorage.getItem('token');
    if (token && token.trim() !== '') {
      headers = {
        ...headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }
  
  headers = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const finalBase = baseUrl ? baseUrl : API_URL;
  const response = await fetch(`${finalBase}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const userApi = {
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    birthDate: string;
  }) =>
    httpClient('/auth/register', { 
      method: 'POST', 
      body: data, 
      baseUrl: 'http://localhost:9003' 
    }),
  login: async (data: { email: string; password: string }) => {
    const response = await httpClient('/auth/login', { 
      method: 'POST', 
      body: data, 
      baseUrl: 'http://localhost:9003' 
    });
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('userEmail', data.email);
    
    return response;
  },
  getUserByEmail: (email: string) =>
    httpClient(`/api/users/email/${encodeURIComponent(email)}`, { 
      method: 'GET',
      baseUrl: 'http://localhost:9003'
    }),
  getProfile: () => httpClient('/api/users/profile', { method: 'GET' }),
  updateUserProfile: (userData: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    birthDate: string;
  }) =>
    httpClient(`/api/users/${userData.id}`, { 
      method: 'PUT', 
      body: userData,
      baseUrl: 'http://localhost:9003'
    }),
};

export const productApi = {
  getProducts: () => httpClient('/api/products', { method: 'GET' }),
  
  getProduct: (id: string) => httpClient(`/api/products/${id}`, { method: 'GET' }),

  deleteProduct: async (id: string) => {
    try {
      const response = await httpClient(`/api/products/${id}`, { 
        method: 'DELETE' 
      });
      
      console.log(`Producto ${id} eliminado exitosamente`);
      return true;
    } catch (error) {
      throw error;
    }
  },
  
  createProduct: (data: {
    name: string;
    price: number;
    imageUrl: string;
    description: string;
  }) => {
    if (!data.name || data.price <= 0) {
      throw new Error('Datos de producto inválidos');
    }
    
    return httpClient('/api/products', { 
      method: 'POST', 
      body: data 
    }).catch(error => {
      console.error('Error creating product:', error);
      throw error;
    });
  },
  
  updateProduct: (id: string, data: {
    name: string;
    price: number;
    imageUrl: string;
    description: string;
  }) => {
    if (!id || !data.name || data.price <= 0) {
      throw new Error('Datos de actualización inválidos');
    }
    
    return httpClient(`/api/products/${id}`, { 
      method: 'PUT', 
      body: data 
    }).catch(error => {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    });
  },
};

export const cartApi = {
  checkoutCart: (cartId: string) =>
    httpClient(`/api/cart/${cartId}/checkout`, { method: 'POST' })
      .then(response => {
        console.log('Checkout Cart Response:', response);
        return response;
      }),
  getCartByUserId: (userId: string) =>
    httpClient(`/api/cart/user/${userId}`, { method: 'GET' })
      .then(response => {
        console.log('Cart by User Response:', response);
        return response;
      }),
  createOrder: (data: {
    items: { productId: string; quantity: number }[];
    total: number;
  }) =>
    httpClient('/api/cart/{id}', { method: 'POST', body: data })
      .then(response => {
        console.log('Create Order Response:', response);
        return response;
      }),
  getOrders: () =>
    httpClient('/orders', { method: 'GET' })
      .then(response => {
        console.log('Orders Response:', response);
        return response;
      }),
};
