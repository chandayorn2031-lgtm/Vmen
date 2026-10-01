export type CategoryType = 'ALL' | 'NEW IN' | 'MEN' | 'WOMEN' | 'ACCESSORIES' | 'SALE';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  sizes: string[];
  inStock: boolean;
  tag?: string;
  rating?: number;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: CartItem[];
  totalAmount: number;
  status: 'placed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface LookbookItem {
  id: string;
  image: string;
  title: string;
  tag: string;
  models: string;
  featuredProductNames: string[];
}
