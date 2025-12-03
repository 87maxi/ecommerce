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

      // Check if contract address exists
      if (!euroTokenAddress) {
        console.warn('EuroToken address not found for chain:', chainId);
        setEuroBalance(null);
        return;
      }

      const contract = new Contract(euroTokenAddress, EURO_TOKEN_ABI, provider);

      // Check if contract exists at address
      const code = await provider.getCode(euroTokenAddress);
      if (code === '0x') {
        console.warn('No contract found at EuroToken address:', euroTokenAddress);
        setEuroBalance(null);
        return;
      }

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
    <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] shadow-sm p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Wallet Address and Role */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 ring-2 ring-indigo-200 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600">
              <path
                fill="currentColor"
                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">
              {formatAddress(address || '')}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {networkName}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.role === 'unregistered'
                  ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300'
                  : 'bg-green-100 text-green-800'
                  }`}
              >
                {roleInfo.role === 'unregistered' && (
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {getRoleText()}
              </span>
            </div>
          </div>
        </div>

        {/* Balance and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          {euroBalance !== null && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-500">Balance EURT</p>
              <p className="text-base font-bold text-gray-900">{euroBalance}</p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={addTokenToWallet}
              className="flex-1 sm:flex-none p-2 rounded-md bg-[var(--muted-light)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
              title="Agregar EURT a Wallet"
            >
              <svg
                className="w-5 h-5"
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
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors touch-manipulation min-h-[44px]"
            >
              Desconectar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
