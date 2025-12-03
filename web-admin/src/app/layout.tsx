'use client';

import { ReactNode } from 'react';

import { Header } from '../components/Header';
import { ThemeProvider } from '../components/ThemeProvider';
import { RoleProvider } from '../contexts/RoleContext';
import { WalletInfo } from '../components/WalletInfo';
import './globals.css';

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased">
        <ThemeProvider>
          <RoleProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
