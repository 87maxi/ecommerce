'use client';

import Link from 'next/link';

import { useRole } from '../contexts/RoleContext';

export function RoleAwareNavigation() {
  const { roleInfo } = useRole();

  // Navigation items for different roles
  const navigationItems = {
    admin: [
      {
        name: 'Empresas',
        href: '/companies',
        description: 'Gestionar todas las empresas',
      },
      {
        name: 'Productos',
        href: '/products',
        description: 'Gestionar todos los productos',
      },
      {
        name: 'Clientes',
        href: '/customers',
        description: 'Gestionar todos los clientes',
      },
    ],
    company_owner: [
      {
        name: 'Mi Empresa',
        href: roleInfo.companyId
          ? `/company/${roleInfo.companyId}`
          : '/companies',
        description: 'Gestionar tu empresa y productos',
      },
    ],
    customer: [
      {
        name: 'Productos',
        href: '/products',
        description: 'Ver y comprar productos',
      },
      { name: 'Mis Órdenes', href: '/orders', description: 'Ver tus órdenes' },
    ],
    unregistered: [
      {
        name: 'Empresas',
        href: '/companies',
        description: 'Ver empresas registradas',
      },
      {
        name: 'Productos',
        href: '/products',
        description: 'Ver productos disponibles',
      },
    ],
  };

  // Determine which navigation items to show based on role
  const currentRole = roleInfo.role as keyof typeof navigationItems;
  const items = navigationItems[currentRole] || navigationItems.unregistered;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {items.map(item => (
        <div key={item.name} className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{item.name}</h2>
          <Link
            href={item.href}
            className="block p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--muted-light)] transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                {getIconForSection(item.name)}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* Recent activity for all users */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-5 border-b border-[var(--border)]">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <svg
                className="w-5 h-5 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Transacciones Recientes
            </h3>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            <li className="px-6 py-8 text-center text-[var(--muted)]">
              <svg
                className="mx-auto h-12 w-12 text-gray-300 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm font-medium">
                No hay transacciones recientes
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper function to get appropriate icon for each section
function getIconForSection(sectionName: string) {
  switch (sectionName) {
    case 'Empresas':
      return (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      );
    case 'Productos':
    case 'Mi Empresa':
      return (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      );
    case 'Clientes':
    case 'Mis Órdenes':
      return (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      );
  }
}
