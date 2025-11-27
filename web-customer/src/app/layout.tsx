'use client';

import '@/app/globals.css';
import WalletConnect from '@/components/WalletConnect';
import { useContract } from '@/hooks/useContract';
import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItemCount, setCartItemCount] = useState(0);
  const { getCartItemCount } = useContract();

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const count = await getCartItemCount();
        setCartItemCount(count);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, [getCartItemCount]);

  return (
    <>
      <html lang="en">
        <body className="bg-background">
          <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <a href="/" className="text-2xl font-bold font-display">
                    <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">E-Shop</span>
                  </a>
                  <nav className="hidden md:flex gap-6">
                    <a href="/products" className="text-foreground/70 hover:text-primary transition-all duration-200 hover:scale-105">
                      Products
                    </a>
                    <a href="/cart" className="text-foreground/70 hover:text-primary transition-all duration-200 hover:scale-105">
                      Cart
                      {cartItemCount > 0 && (
                        <span className="ml-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                          {cartItemCount}
                        </span>
                      )}
                    </a>
                    <a href="/orders" className="text-foreground/70 hover:text-primary transition-all duration-200 hover:scale-105">
                      Orders
                    </a>
                    <a
                      href="/buy-eurocoins"
                      className="text-foreground/70 hover:text-accent transition-all duration-200 hover:scale-105 font-medium flex items-center gap-1"
                    >
                      <span>💰</span>
                      Buy Eurocoins
                    </a>
                  </nav>
                </div>
                <WalletConnect />
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="bg-card border-t border-border mt-16">
            <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
              <p>&copy; 2025 Blockchain E-Commerce. Powered by Ethereum & EURT.</p>
            </div>
          </footer>
        </body>
      </html>
    </>
  );
}

// eslint-disable-next-line @next/next/no-css-tags
// This is necessary to ensure globals.css is imported