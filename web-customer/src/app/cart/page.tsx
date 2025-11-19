'use client';

import { useState, useEffect } from 'react';

interface CartItem {
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
  };
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading cart from local storage or contract
    setTimeout(() => {
      const mockCartItems: CartItem[] = [
        {
          product: {
            id: 1,
            name: "Blockchain T-Shirt",
            price: "50",
            image: "/placeholder-product.jpg"
          },
          quantity: 2
        },
        {
          product: {
            id: 2,
            name: "Crypto Hoodie",
            price: "80",
            image: "/placeholder-product.jpg"
          },
          quantity: 1
        }
      ];
      setCartItems(mockCartItems);
      setLoading(false);
    }, 1000);
  }, []);

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(
      cartItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseInt(item.product.price) * item.quantity);
    }, 0);
  };

  const proceedToCheckout = () => {
    // This will be implemented with contract interaction
    alert('Proceeding to checkout...');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-display text-foreground">Shopping Cart</h1>
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-xl mb-4"></div>
          <div className="h-32 bg-muted rounded-xl mb-4"></div>
          <div className="h-16 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8 font-display text-foreground">Shopping Cart</h1>
        <p className="text-muted-foreground text-xl">Your cart is empty</p>
        <a 
          href="/products" 
          className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 border border-primary/20 shadow-lg hover:shadow-primary/20"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-display text-foreground">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex items-center gap-4 border-b border-border py-4 hover:bg-card/50 transition-all duration-300 p-4 rounded-xl">
              <img 
                src={item.product.image} 
                alt={item.product.name} 
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                <p className="text-primary font-bold">{item.product.price} EURT</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-muted transition-all duration-200"
                >
                  -
                </button>
                <span className="w-8 text-center text-foreground">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-muted transition-all duration-200"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{parseInt(item.product.price) * item.quantity} EURT</p>
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-destructive text-sm hover:underline hover:text-destructive/80 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border sticky top-24 self-start">
          <h2 className="text-xl font-bold mb-4 text-foreground">Order Summary</h2>
          <div className="flex justify-between mb-2 text-muted-foreground">
            <span>Subtotal</span>
            <span>{calculateTotal()} EURT</span>
          </div>
          <div className="flex justify-between mb-2 text-muted-foreground">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between mb-6 pt-2 border-t border-border">
            <span className="font-bold text-foreground">Total</span>
            <span className="font-bold text-primary">{calculateTotal()} EURT</span>
          </div>
          <button
            onClick={proceedToCheckout}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 border border-primary/20 shadow-lg hover:shadow-primary/20"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}