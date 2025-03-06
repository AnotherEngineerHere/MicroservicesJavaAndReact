export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  address: string;
  birthDate: string;
  password: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock:number;
  description: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}