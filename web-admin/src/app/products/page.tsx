'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useContract } from '../../hooks/useContract';
import Link from 'next/link';
import { formatAddress } from '../../lib/utils';
import { Product } from '../../types';

export default function ProductsPage() {
  const { isConnected, provider, signer, chainId } = useWallet();
  const ecommerceContract = useContract('Ecommerce', provider, signer, chainId);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ecommerceContract) return;
    
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Esta función necesita ser implementada en el contrato
        // Por ahora mostramos un mensaje indicando que se implementará
        setError('Funcionalidad pendiente de implementación en el contrato');
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [ecommerceContract]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900">Acceso Restringido</h1>
          <p className="mt-4 text-lg text-gray-500">
            Por favor, conecta tu billetera para acceder al panel de administración.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Conectar Billetera
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona todos los productos registrados en el e-commerce descentralizado.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-gray-600">Cargando productos...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <p className="text-yellow-800">{error}</p>
              </div>
              <Link
                href="/companies"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ver Empresas
              </Link>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16" />
              </svg>
              <p className="mt-2">No hay productos registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      <div className="mt-2 text-xs text-gray-500 space-y-1">
                        <p>ID: {product.id}</p>
                        <p>Empresa: {product.companyId}</p>
                        <p>Precio: {product.price} EURT</p>
                        <p>Stock: {product.stock}</p>
                        <p>Estado: {product.isActive ? 'Activo' : 'Inactivo'}</p>
                        {product.imageHash && (
                          <p>Imagen: {product.imageHash.slice(0, 12)}...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}