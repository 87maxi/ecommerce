'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION } from '../lib/routes';
import { WalletInfo } from './WalletInfo';

export function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
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
            {NAVIGATION.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
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
    </div>
  );
}