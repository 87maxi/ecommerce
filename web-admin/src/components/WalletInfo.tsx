'use client';

import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { useState, useEffect } from 'react';

import { useWallet } from '../hooks/useWallet';
import { getContractAddress } from '../lib/contracts/addresses';
import { useRole } from '../contexts/RoleContext';
import { formatAddress } from '../lib/utils';

const EURO_TOKEN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export function WalletInfo() {
  const {
    disconnect,
    isConnected,
    address,
    chainId,
  } = useWallet();
  
  const { roleInfo } = useRole();
  const [euroBalance, setEuroBalance] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>('');

  const handleDisconnect = () => {
    disconnect();
    setEuroBalance(null);
  };

  const fetchBalance = async () => {
    if (!address || !window.ethereum || !chainId) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const euroTokenAddress = getContractAddress(chainId, 'EuroToken');
      const contract = new Contract(euroTokenAddress, EURO_TOKEN_ABI, provider);
      const balance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();

      const formatted = formatUnits(balance, decimals);
      setEuroBalance(parseFloat(formatted).toFixed(2));
    } catch (err) {
      console.error('Error fetching balance:', err);
      setEuroBalance(null);
    }
  };

  const addTokenToWallet = async () => {
    if (!window.ethereum || !chainId) return;

    try {
      const euroTokenAddress = getContractAddress(chainId, 'EuroToken');
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: euroTokenAddress,
            symbol: 'EURT',
            decimals: 18,
          },
        } as any,
      });
    } catch (error) {
      console.error('Error adding token to wallet:', error);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchBalance();
    }
  }, [isConnected, address, chainId]);

  useEffect(() => {
    if (chainId) {
      switch (chainId) {
        case 1:
          setNetworkName('Ethereum Mainnet');
          break;
        case 31337:
          setNetworkName('Localhost');
          break;
        default:
          setNetworkName(`Red ${chainId}`);
      }
    }
  }, [chainId]);

  if (!isConnected) {
    return null;
  }

  const getRoleText = () => {
    switch (roleInfo.role) {
      case 'admin':
        return 'Administrador';
      case 'company_owner':
        return `Propietario${roleInfo.companyName ? ` de ${roleInfo.companyName}` : ''}`;
      case 'customer':
        return 'Cliente';
      case 'unregistered':
        return 'No registrado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] shadow-sm p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 ring-2 ring-indigo-200 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-600">
              <path
                fill="currentColor"
                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              {formatAddress(address || '')}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {networkName}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {getRoleText()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {euroBalance !== null && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-500">Balance EURT</p>
              <p className="text-sm font-bold text-gray-900">{euroBalance}</p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={addTokenToWallet}
              className="p-2 rounded-md bg-[var(--muted-light)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              title="Agregar EURT a Wallet"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
            <button
              onClick={handleDisconnect}
              className="px-3 py-2 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              Desconectar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
