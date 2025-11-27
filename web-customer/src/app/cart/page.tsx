'use client';

import { useState, useEffect } from 'react';
import { useContract } from '@/hooks/useContract';
import { useWallet } from '@/hooks/useWallet';

interface CartItem {
  product: {
    id: number;
    companyId: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    image: string;
    active: boolean;
  };
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { getCart, calculateTotal: getCartTotal, removeFromCart, updateQuantity, createInvoice } = useContract();
  const { isConnected, connectWallet } = useWallet();

  useEffect(() => {
    const fetchCart = async () => {
      if (isConnected) {
        try {
          const items = await getCart();
          setCartItems(items);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      } else {
        setCartItems([]);
      }
      setLoading(false);
    };
    
    fetchCart();
  }, [getCart, isConnected]);

  const handleRemoveFromCart = async (productId: number) => {
    try {
      const success = await removeFromCart(productId);
      if (success) {
        // Update local state optimistically
        setCartItems(cartItems.filter(item => item.product.id !== productId));
      }
      console.log('Product removed from cart');
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    try {
      const success = await updateQuantity(productId, newQuantity);
      if (success) {
        // Update local state optimistically
        setCartItems(
          cartItems.map(item => 
            item.product.id === productId 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        );
      }
      console.log('Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const calculateTotal = async () => {
    try {
      const total = await getCartTotal();
      return parseFloat(total).toFixed(2);
    } catch (error) {
      console.error('Error calculating total:', error);
      return '0';
    }
  };

  const proceedToCheckout = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    
    try {
      // Get unique company IDs from cart items
      const companyIds = [...new Set(cartItems.map(item => item.product.companyId))];
      
      if (companyIds.length === 0) {
        throw new Error('No items in cart');
      }
      
      // For now, create invoice for the first company
      const companyId = companyIds[0];
      const invoiceId = await createInvoice(companyId);
      
      if (invoiceId) {
        // Clear local cart state
        setCartItems([]);
        // Redirect to payment page
        window.location.href = `/payment/${invoiceId}`;
        console.log('Invoice created:', invoiceId);
      } else {
        throw new Error('Failed to create invoice');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
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
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-muted transition-all duration-200"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-foreground">{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-muted transition-all duration-200"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{parseFloat(item.product.price) * item.quantity} EURT</p>
                  <button 
                    onClick={() => handleRemoveFromCart(item.product.id)}
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