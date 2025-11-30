'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { getContractAddress } from '../lib/contracts/addresses';

const EURO_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export function WalletConnect() {
  const {
    connect,
    disconnect,
    isConnected,
    address,
    chainId,
    connecting,
    error
  } = useWallet();

  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [euroBalance, setEuroBalance] = useState<string | null>(null);

  const walletInfo = {
    provider: 'metamask' as const,
    info: {
      label: 'MetaMask',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    },
  };

  const handleConnect = async () => {
    await connect(walletInfo);
  };

  const handleDisconnect = () => {
    disconnect();
    setEuroBalance(null);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const fetchBalance = async () => {
    if (!address || !window.ethereum || !chainId) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const euroTokenAddress = getContractAddress(chainId, 'EuroToken');
      const contract = new Contract(euroTokenAddress, EURO_TOKEN_ABI, provider);
      const balance = await contract.balanceOf(address);
      const formatted = formatUnits(balance, 18); // Assuming 18 decimals
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
        },
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

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <div className="text-center">
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {connecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Conectando...
              </>
            ) : 'Conectar MetaMask'}
          </button>
          <p className="mt-3 text-sm text-gray-500">
            Conecta tu billetera para acceder al panel de administración
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-600">
                    <path
                      fill="currentColor"
                      d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
                    />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatAddress(address!)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Red: {chainId}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setShowNetworkSelector(!showNetworkSelector)}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Red
                </button>
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 text-xs font-medium border border-red-200 rounded-md text-red-700 hover:bg-red-50 transition-colors"
                >
                  Salir
                </button>
              </div>
            </div>

            {/* EuroToken Balance Section */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Saldo EuroToken</p>
                  <p className="text-lg font-bold text-emerald-600 font-mono">
                    {euroBalance !== null ? `€${euroBalance}` : 'Cargando...'}
                  </p>
                </div>
                <button
                  onClick={addTokenToWallet}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors text-xs font-medium border border-indigo-200"
                  title="Agregar EURT a MetaMask"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Agregar a Wallet</span>
                </button>
              </div>
            </div>
          </div>

          {showNetworkSelector && (
            <div className="p-3 bg-white border border-gray-200 rounded-md shadow-sm space-y-2">
              <p className="text-xs font-medium text-gray-700">Seleccionar Red:</p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    // Simulando cambio a red local (Anvil)
                    console.log('Switching to network 31337');
                    setShowNetworkSelector(false);
                  }}
                  className="px-3 py-2 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-left w-full"
                >
                  <div className="font-medium">Ethereum Local</div>
                  <div className="text-gray-500">Chain ID: 31337</div>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}