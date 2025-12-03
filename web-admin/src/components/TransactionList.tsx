'use client';

import React from 'react';

interface Transaction {
  id: string;
  type: string;
  amount: string;
  from: string;
  to: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
}

export function TransactionList({ transactions, title = 'Transacciones Recientes' }: TransactionListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '0x000...0000';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Ordenar transacciones por fecha (más recientes primero)
  const sortedTransactions = [...transactions].sort((a, b) => {
    // Aquí podrías implementar un ordenamiento real si tuvieras timestamps reales
    return -1; // Mantener el orden actual
  });

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg transition-all duration-200 hover:shadow-md">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9v6m14-6v-2a2 2 0 00-2-2H9a2 2 0 00-2 2" />
          </svg>
          {title}
        </h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {transactions.length === 0 ? (
          <li className="px-6 py-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium">No hay transacciones recientes</p>
          </li>
        ) : (
          sortedTransactions.map((transaction) => (
            <li key={transaction.id} className="transition-colors duration-150 hover:bg-gray-50">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {transaction.type}
                    </p>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.amount}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0">
                    <p className="flex items-center text-sm text-gray-500">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100">De</span>
                      <span className="ml-2 font-mono">{formatAddress(transaction.from)}</span>
                    </p>
                    <p className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0 sm:ml-4">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100">Para</span>
                      <span className="ml-2 font-mono">{formatAddress(transaction.to)}</span>
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <time dateTime={transaction.timestamp} className="text-xs">
                      {transaction.timestamp}
                    </time>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
