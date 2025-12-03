'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION } from '../lib/routes';
import { WalletInfo } from './WalletInfo';
import { ConnectWalletButton } from './ConnectWalletButton';
import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useRole } from '../contexts/RoleContext';

export function Sidebar() {
  const pathname = usePathname();
  const { isConnected } = useWallet();
  const { roleInfo } = useRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show connect screen when not connected
  if (!isConnected) {
    return (
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-grow justify-center items-center p-8">
          {/* Logo/Brand */}
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.94 13.06a1.5 1.5 0 010-2.12l6-6a1.5 1.5 0 012.12 0l6 6a1.5 1.5 0 01-2.12 2.12L12 7.62l-4.94 4.94a1.5 1.5 0 01-2.12 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h2>
            <p className="text-sm text-gray-500">E-Commerce Descentralizado</p>
          </div>

          {/* Connect Button */}
          <ConnectWalletButton />

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 mb-2">
              Conecta tu billetera para acceder
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter navigation items based on role
  const filteredNavigation = NAVIGATION.filter(item =>
    item.allowedRoles.includes(roleInfo.role)
  );

  return (
    <>
      {/* Mobile menu button (only visible on mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-10 md:z-0 md:translate-x-0 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64 flex-shrink-0 flex flex-col h-full border-r border-gray-200 bg-white overflow-y-auto`}
      >
        <div className="flex items-center flex-shrink-0 px-4 py-5 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.94 13.06a1.5 1.5 0 010-2.12l6-6a1.5 1.5 0 012.12 0l6 6a1.5 1.5 0 01-2.12 2.12L12 7.62l-4.94 4.94a1.5 1.5 0 01-2.12 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </Link>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${isActive
                    ? 'bg-indigo-100 text-indigo-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-500 group-hover:text-indigo-600">
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <WalletInfo />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}