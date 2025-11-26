// Tipos comunes para la aplicación

export interface Company {
  id: string;
  owner: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  description: string;
  price: string;
  imageHash: string;
  stock: number;
  isActive: boolean;
}

export interface Customer {
  id: string;
  address: string;
  name: string;
  email: string;
  registeredAt: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  companyId: string;
  products: OrderProduct[];
  totalAmount: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface OrderProduct {
  productId: string;
  quantity: number;
  price: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: string;
  from: string;
  to: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Stats {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}