'use client';

import { useWallet } from '../hooks/useWallet';
import { useBalance } from '../hooks/useBalance';
import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const { isConnected, address, chainId, disconnect } = useWallet();
  const { balance, loading, error } = useBalance(address);
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Navegación */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.94 13.06a1.5 1.5 0 010-2.12l6-6a1.5 1.5 0 012.12 0l6 6a1.5 1.5 0 01-2.12 2.12L12 7.62l-4.94 4.94a1.5 1.5 0 01-2.12 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>
            
            {isConnected && (
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/companies"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Empresas
                </Link>
                <Link
                  href="/products"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Productos
                </Link>
                <Link
                  href="/customers"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Clientes
                </Link>
              </nav>
            )}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>{formatAddress(address!)}</span>
                  <span className="text-xs text-gray-500">({chainId})</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Conectado</p>
                      <p className="text-xs text-gray-500">{formatAddress(address!)}</p>
                      <p className="text-xs text-gray-500 mt-1">Red: {chainId}</p>
                      
                      {/* EURT Balance Display */}
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">Saldo EURT</p>
                        <p className="text-sm font-bold text-emerald-600 font-mono">
                          {loading ? 'Cargando...' : balance !== null ? `€${balance}` : 'N/A'}
                        </p>
                        {error && (
                          <p className="text-xs text-red-500 mt-1">{error}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        disconnect();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Desconectar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2">
                <p className="text-sm text-yellow-800">
                  Conecta tu billetera para comenzar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
