'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock products data - will be replaced with contract calls
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Blockchain T-Shirt",
        description: "Comfortable cotton t-shirt with blockchain logo",
        price: "50",
        image: "/placeholder-product.jpg"
      },
      {
        id: 2,
        name: "Crypto Hoodie",
        description: "Warm hoodie for crypto enthusiasts",
        price: "80",
        image: "/placeholder-product.jpg"
      },
      {
        id: 3,
        name: "Web3 Cap",
        description: "Stylish cap for web3 developers",
        price: "30",
        image: "/placeholder-product.jpg"
      }
    ];
    
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const addToCart = (product: Product) => {
    // This will be implemented with contract interaction
    console.log('Added to cart:', product);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-display text-foreground">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border rounded-2xl p-6 animate-pulse bg-card/50">
              <div className="bg-muted h-48 mb-4 rounded-xl"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-display text-foreground">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-card/50 backdrop-blur-sm group">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-foreground">{product.name}</h3>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary">{product.price} EURT</span>
                <button
                  onClick={() => addToCart(product)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 border border-primary/20 shadow-lg hover:shadow-primary/20"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}