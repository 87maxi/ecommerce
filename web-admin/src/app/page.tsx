'use client';

import { useWallet } from '../hooks/useWallet';
import { WalletConnect } from '@/components/WalletConnect';
import { StatsCard } from '@/components/StatsCard';
import { TransactionList } from '@/components/TransactionList';
import Link from 'next/link';
import { useDashboardData } from '../hooks/useDashboardData';

export default function Home() {
  const { address, chainId, isConnected } = useWallet();
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardData();

  // Convertimos los datos del dashboard en el formato esperado por StatsCard
  const stats = [
    {
      title: 'Empresas', 
      value: dashboardData.companyCount.toLocaleString(), 
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ), 
      color: 'bg-indigo-500'
    },
    {
      title: 'Productos', 
      value: dashboardData.productCount.toLocaleString(), 
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ), 
      color: 'bg-green-500'
    },
    {
      title: 'Clientes', 
      value: dashboardData.customerCount.toLocaleString(), 
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ), 
      color: 'bg-purple-500'
    },
    {
      title: 'Ventas', 
      value: dashboardData.totalSales.toLocaleString(), 
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
      color: 'bg-yellow-500'
    },
  ];

  // Usamos las transacciones reales del dashboard o un array vacío si no hay datos
  const transactions = dashboardData.recentTransactions;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Panel de Administración
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Gestiona empresas, productos y clientes en el e-commerce descentralizado
          </p>
        </div>

        <div className="mt-8">
          <WalletConnect />

          {isConnected && (
            <>
              <div className="mt-8">
                <div className="p-4 bg-blue-50 rounded-md mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Conectado:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    <strong>Red:</strong> {chainId}
                  </p>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                  {stats.map((stat, index) => (
                    <StatsCard
                      key={index}
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Navegación rápida */}
                  <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Acceso Rápido</h2>
                    <div className="space-y-4">
                      <Link
                        href="/companies"
                        className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Empresas</h3>
                            <p className="text-sm text-gray-500">Gestionar empresas registradas</p>
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/products"
                        className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-green-500 text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Productos</h3>
                            <p className="text-sm text-gray-500">Gestionar todos los productos</p>
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/customers"
                        className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-purple-500 text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Clientes</h3>
                            <p className="text-sm text-gray-500">Gestionar clientes registrados</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Transacciones recientes */}
                  <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
                    <TransactionList transactions={transactions as any} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}