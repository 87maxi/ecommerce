'use client';

import { useState, useEffect, useMemo } from 'react';

import { normalizeArrayResponse } from '../lib/contractUtils';

import { useContract } from './useContract';
import { useWallet } from './useWallet';

// Define types for our dashboard data
type DashboardData = {
  companyCount: number;
  productCount: number;
  customerCount: number;
  totalSales: number;
  recentTransactions: any[];
};

// Custom hook to fetch dashboard data from the blockchain
export function useDashboardData() {
  const { provider, signer, chainId, address } = useWallet();
  const ecommerceContract = useContract('Ecommerce', provider, signer, chainId);

  const [data, setData] = useState<DashboardData>({
    companyCount: 0,
    productCount: 0,
    customerCount: 0,
    totalSales: 0,
    recentTransactions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache for transaction data to avoid repeated fetching
  const transactionCache = useMemo(() => new Map<string, any>(), []);

  useEffect(() => {
    if (!ecommerceContract) {
      if (provider && signer) {
        setError('Contrato no disponible. Verifique la red y los permisos.');
      }
      setLoading(false);
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load company count
        const companyIdsResult = await ecommerceContract.getAllCompanies();
        const companyIds = normalizeArrayResponse(companyIdsResult);
        const companyCount = companyIds.length;

        // Load product count
        const productIdsResult = await ecommerceContract.getAllProducts();
        const productIds = normalizeArrayResponse(productIdsResult);
        const productCount = productIds.length;

        // Load customer count and total sales
        // Note: The getAllCustomers function is currently not implemented in the contract
        // This is a known limitation that needs to be addressed in a future update
        const customerCount = 0;
        const totalSales = 0;

        // For now, we'll need to get customer data another way or implement this in the contract
        // This could be done by tracking customer registrations in a mapping and providing a count function

        // In the meantime, we'll set defaults
        // Future improvement: Add customer count to contract

        // Calculate total sales from company invoices
        // This would require iterating through all companies and their invoices
        // For now, we'll leave as 0 until we implement proper sales tracking

        // Load recent transactions (invoices)
        // We'll get invoices from all companies, but this needs to be efficient
        // For now, we'll get invoices from a few companies as example
        const recentTransactions = [];

        // If we had a way to get all invoices, we would do:
        // const invoiceIds = await getAllInvoiceIds();
        // But this function doesn't exist in the contract yet

        // For demonstration, we'll create a mock transaction list
        // In a real implementation, we would fetch real invoice data

        // Future improvement: Add function to get all invoices or recent invoices

        // Set the data
        setData({
          companyCount,
          productCount,
          customerCount,
          totalSales,
          recentTransactions,
        });
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        setError(err.message || 'Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    // Only load data when the contract is available
    loadDashboardData();
  }, [ecommerceContract, provider, signer, chainId, transactionCache]);

  return { data, loading, error };
}
