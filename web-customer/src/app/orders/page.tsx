'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  date: string;
  total: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  items: {
    product: {
      name: string;
      price: string;
      image: string;
    };
    quantity: number;
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading orders from contract
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: 1,
          date: '2025-01-15',
          total: '180',
          status: 'Delivered',
          items: [
            {
              product: {
                name: "Blockchain T-Shirt",
                price: "50",
                image: "/placeholder-product.jpg"
              },
              quantity: 2
            },
            {
              product: {
                name: "Crypto Hoodie",
                price: "80",
                image: "/placeholder-product.jpg"
              },
              quantity: 1
            }
          ]
        },
        {
          id: 2,
          date: '2025-02-01',
          total: '30',
          status: 'Shipped',
          items: [
            {
              product: {
                name: "Web3 Cap",
                price: "30",
                image: "/placeholder-product.jpg"
              },
              quantity: 1
            }
          ]
        }
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-display text-foreground">Order History</h1>
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-xl mb-4"></div>
          <div className="h-32 bg-muted rounded-xl mb-4"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8 font-display text-foreground">Order History</h1>
        <p className="text-muted-foreground text-xl">You have no order history</p>
        <a 
          href="/products" 
          className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 border border-primary/20 shadow-lg hover:shadow-primary/20"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-display text-foreground">Order History</h1>
      
      {orders.map((order) => (
        <div key={order.id} className="border border-border rounded-2xl p-6 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Order #{order.id}</h2>
              <p className="text-muted-foreground">{order.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' : order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                {order.status}
              </span>
              <div className="text-right">
                <p className="font-bold text-primary">{order.total} EURT</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl border border-border hover:bg-secondary/50 transition-all duration-300">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="w-12 h-12 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-primary">{parseInt(item.product.price) * item.quantity} EURT</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}