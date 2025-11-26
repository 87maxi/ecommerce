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
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {transactions.length === 0 ? (
          <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
            No hay transacciones recientes
          </li>
        ) : (
          transactions.map((transaction) => (
            <li key={transaction.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {transaction.type}
                    </p>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.amount}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      De: {formatAddress(transaction.from)}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      Para: {formatAddress(transaction.to)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <time dateTime={transaction.timestamp}>
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