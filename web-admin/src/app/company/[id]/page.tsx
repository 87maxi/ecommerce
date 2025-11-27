'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useWallet } from '../../../hooks/useWallet';
import { useContract } from '../../../hooks/useContract';
import Link from 'next/link';
import { formatAddress, formatDate } from '../../../lib/utils';
import { Company, Product } from '../../../types';
import { normalizeCompany, normalizeProduct, normalizeArrayResponse } from '../../../lib/contractUtils';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  imageHash: string;
  stock: string;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;
  
  const { isConnected, provider, signer, chainId, address } = useWallet();
  const ecommerceContract = useContract('Ecommerce', provider, signer, chainId);
  
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    imageHash: '',
    stock: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ecommerceContract || !companyId) return;
    
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        
        // Load company details using normalization
        const companyResult = await ecommerceContract.getCompany(BigInt(companyId));
        const normalizedCompany = normalizeCompany(companyResult, companyId);
        setCompany(normalizedCompany);

        // Load company products
        const productIdsResult = await ecommerceContract.getProductsByCompany(BigInt(companyId));
        const productIds = normalizeArrayResponse(productIdsResult);
        const productData = await Promise.all(
          productIds.map(async (id: bigint) => {
            const productResult = await ecommerceContract.getProduct(id);
            return normalizeProduct(productResult, id);
          })
        );
        
        setProducts(productData);
      } catch (err) {
        console.error('Error loading company data:', err);
        setError('Failed to load company data');
      } finally {
        setLoading(false);
      }
    };
    
    loadCompanyData();
  }, [ecommerceContract, companyId]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ecommerceContract || !companyId) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const tx = await ecommerceContract.addProduct(
        BigInt(companyId),
        productFormData.name,
        productFormData.description,
        BigInt(Math.floor(parseFloat(productFormData.price) * 1000000)), // Assuming 6 decimals
        productFormData.imageHash,
        BigInt(productFormData.stock)
      );
      await tx.wait();

      // Refresh products list
      const productIdsResult = await ecommerceContract.getProductsByCompany(BigInt(companyId));
      const productIds = normalizeArrayResponse(productIdsResult);
      const productData = await Promise.all(
        productIds.map(async (id: bigint) => {
          const productResult = await ecommerceContract.getProduct(id);
          return normalizeProduct(productResult, id);
        })
      );
      
      setProducts(productData);
      setProductFormData({ name: '', description: '', price: '', imageHash: '', stock: '' });
    } catch (err: any) {
      console.error('Error adding product:', err);
      setError(err.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const isCompanyOwner = company && address && company.owner.toLowerCase() === address.toLowerCase();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información de la empresa...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900">Empresa no encontrada</h1>
          <p className="mt-4 text-lg text-gray-500">
            La empresa solicitada no existe o no tienes acceso a ella.
          </p>
          <div className="mt-8">
            <Link
              href="/companies"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Volver a Empresas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              <p className="mt-2 text-gray-600">{company.description}</p>
              <div className="mt-2 text-sm text-gray-500 space-y-1">
                <p>ID: {company.id}</p>
                <p>Propietario: {formatAddress(company.owner)}</p>
                <p>Estado: {company.isActive ? 'Activa' : 'Inactiva'}</p>
                <p>Registrada: {formatDate(company.createdAt)}</p>
              </div>
            </div>
            <Link
              href="/companies"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Volver
            </Link>
          </div>
        </div>

        {!isCompanyOwner && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
            <p className="text-yellow-800">
              Solo el propietario de esta empresa puede gestionar sus productos.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Producto (solo para el propietario) */}
          {isCompanyOwner && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Agregar Producto</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nombre del producto"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Descripción del producto"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Precio (EURT)
                  </label>
                  <input
                    type="number"
                    id="price"
                    step="0.01"
                    min="0"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    min="0"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="imageHash" className="block text-sm font-medium text-gray-700">
                    Hash de Imagen (IPFS)
                  </label>
                  <input
                    type="text"
                    id="imageHash"
                    value={productFormData.imageHash}
                    onChange={(e) => setProductFormData({ ...productFormData, imageHash: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Qm..."
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {submitting ? 'Agregando...' : 'Agregar Producto'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Productos */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Productos de la Empresa</h2>
            
            {products.length === 0 ? (
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
    </div>
  );
}
