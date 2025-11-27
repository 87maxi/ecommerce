'use client';

import { useState, useEffect } from 'react';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/hooks/useWallet';

interface OrderItem {
  product: {
    name: string;
    price: string;
    image: string;
  };
  quantity: number;
}

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
  const { getCustomerInvoices } = useContract();
  const { isConnected, account } = useWallet();

  useEffect(() => {
    const fetchOrders = async () => {
      if (isConnected && account) {
        try {
          // Get invoices for this customer
          const invoices = await getCustomerInvoices(account);

          const fetchedOrders = invoices.map((invoice: any) => {
            return {
              id: invoice.id,
              date: invoice.timestamp,
              total: invoice.totalAmount,
              status: (invoice.isPaid ? 'Delivered' : 'Pending') as 'Pending' | 'Shipped' | 'Delivered',
              items: invoice.items.map((item: any) => ({
                product: {
                  name: item.productName,
                  price: item.unitPrice,
                  image: "/placeholder-product.jpg" // Image not available in invoice items
                },
                quantity: item.quantity
              }))
            };
          });

          setOrders(fetchedOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      } else {
        setOrders([]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [getCustomerInvoices, isConnected, account]);

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