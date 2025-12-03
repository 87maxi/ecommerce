'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useWallet } from '../hooks/useWallet';

import { RoleIndicator } from './RoleIndicator';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './ThemeProvider';


export function Header() {
  const { isConnected } = useWallet();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const baseNavigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Empresas', href: '/companies' },
    { name: 'Productos', href: '/products' },
    { name: 'Clientes', href: '/customers' },
  ];

  // Navigation will be handled by the dashboard components based on role
  // We'll keep a minimal navigation in header for now

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">
                  E-Commerce Admin
                </h1>
                <p className="text-xs text-gray-500">Panel de Administración</p>
              </div>
            </Link>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4 flex-1 justify-center">
            <RoleIndicator />
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-[var(--muted-light)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>


          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 py-3 space-y-1 flex flex-col items-start">
          <RoleIndicator />

        </div>
      </div>
    </header>
  );
}
