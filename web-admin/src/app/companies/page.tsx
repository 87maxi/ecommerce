'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useContract } from '../../hooks/useContract';
import Link from 'next/link';
import { formatAddress, formatDate } from '../../lib/utils';
import { Company } from '../../types';
import { normalizeCompany, normalizeArrayResponse } from '../../lib/contractUtils';

interface CompanyFormData {
  address: string;
  name: string;
  description: string;
}

export default function CompaniesPage() {
  const { isConnected, provider, signer, chainId } = useWallet();
  const ecommerceContract = useContract('Ecommerce', provider, signer, chainId);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CompanyFormData>({
    address: '',
    name: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ecommerceContract) return;

    const loadCompanies = async () => {
      try {
        setLoading(true);
        console.log('Loading companies...');

        const companyIdsResult = await ecommerceContract.getAllCompanies();
        console.log('Company IDs result:', companyIdsResult);

        // Handle different return types using utility function
        const companyIds = normalizeArrayResponse(companyIdsResult);

        console.log('Company IDs:', companyIds);

        const companyDataPromises = companyIds.map(async (id: any) => {
          try {
            console.log('Fetching company with ID:', id);
            const companyResult = await ecommerceContract.getCompany(id);
            console.log('Company result:', companyResult);

            // Normalize company data using utility function
            const normalizedCompany = normalizeCompany(companyResult, id);

            console.log('Processed company:', normalizedCompany);

            return normalizedCompany;
          } catch (err) {
            console.error(`Error loading company ${id}:`, err);
            return null;
          }
        });

        const companyDataResults = await Promise.all(companyDataPromises);
        const companyData = companyDataResults.filter((c: Company | null): c is Company => c !== null);

        console.log('Final company data:', companyData);
        setCompanies(companyData);
      } catch (err) {
        console.error('Error loading companies:', err);
        setError('Failed to load companies: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [ecommerceContract]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ecommerceContract) return;

    setSubmitting(true);
    setError(null);

    try {
      console.log('Registering company with data:', formData);
      const tx = await ecommerceContract.registerCompany(
        formData.address,
        formData.name,
        formData.description
      );
      console.log('Transaction sent:', tx);
      await tx.wait();
      console.log('Transaction confirmed');

      // Refresh companies list
      const companyIdsResult = await ecommerceContract.getAllCompanies();
      const companyIds = normalizeArrayResponse(companyIdsResult);

      const companyDataPromises = companyIds.map(async (id: any) => {
        try {
          const companyResult = await ecommerceContract.getCompany(id);
          return normalizeCompany(companyResult, id);
        } catch (err) {
          console.error(`Error loading company ${id}:`, err);
          return null;
        }
      });

      const companyDataResults = await Promise.all(companyDataPromises);
      const companyData = companyDataResults.filter((c: Company | null): c is Company => c !== null);

      setCompanies(companyData);
      setFormData({ address: '', name: '', description: '' });
    } catch (err: any) {
      console.error('Error registering company:', err);
      setError(err.message || 'Failed to register company');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Empresas</h1>
          <p className="mt-2 text-sm text-gray-600">
            Registra nuevas empresas y gestiona las existentes en el e-commerce descentralizado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Registro */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Registrar Nueva Empresa</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Dirección de la Empresa
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0x..."
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nombre de la empresa"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-blue-50 text-gray-900"
                  placeholder="Descripción de la empresa"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submitting ? 'Registrando...' : 'Registrar Empresa'}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Empresas */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Empresas Registradas</h2>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">Cargando empresas...</span>
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-8m8 0v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4h18z" />
                </svg>
                <p className="mt-2">No hay empresas registradas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {companies.map((company) => (
                  <div key={company.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{company.description}</p>
                        <div className="mt-2 text-xs text-gray-500 space-y-1">
                          <p>ID: {company.id}</p>
                          <p>Propietario: {formatAddress(company.owner)}</p>
                          <p>Estado: {company.isActive ? 'Activa' : 'Inactiva'}</p>
                          <p>Registrada: {formatDate(company.createdAt)}</p>
                        </div>
                      </div>
                      <Link
                        href={`/company/${company.id}`}
                        className="ml-4 px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                      >
                        Gestionar
                      </Link>
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

