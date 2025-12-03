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
      label: 'Wallet',
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
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();
      console.log('Balance:', balance.toString());
      console.log('Decimals:', decimals);
      console.log('Symbol:', symbol);
      
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

  // Mostrar error de red si está conectado pero en red incorrecta
  if (isConnected && chainId !== 31337) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.668l.794-1.687a.5.5 0 01.927.05l.5.95A.5.5 0 0110.5 3.5h-.5a.5.5 0 01-.5-.415l-.043-.824zm2.02 2.226a1 1 0 011.568 0l1.3 1a1 1 0 01.309.805v5.814a1 1 0 01-.878.995l-.115.005H6.5a1 1 0 01-.995-.878l-.005-.115v-5.814a1 1 0 01.88-.995l1.3-.999zM5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800">Red no soportada</p>
            <p className="text-sm text-yellow-700">Por favor, cambia a la red local (Chain ID: 31337)</p>
          </div>
        </div>
      </div>
    );
  }

  const walletContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%'
  };

  return (
    <div className="space-y-4" style={walletContainerStyle}>
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
            ) : 'Conectar Wallet'}
          </button>
          <p className="mt-3 text-sm text-gray-500">
            Conecta tu billetera para acceder al panel de administración
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col space-y-3 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 ring-2 ring-indigo-200 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-600">
                    <path
                      fill="currentColor"
                      d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
                    />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {formatAddress(address!)}
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(address)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copiar dirección"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Red: {chainId}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 flex-shrink-0">
                <button
                  onClick={async () => {
                    try {
                      await window.ethereum?.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x7A69' }],
                      });
                    } catch (switchError: any) {
                      // Si la red no está agregada, intenta agregarla
                      if (switchError.code === 4902) {
                        try {
                          await window.ethereum?.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                              chainId: '0x7A69',
                              chainName: 'Localhost 8545',
                              nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18,
                              },
                              rpcUrls: ['http://127.0.0.1:8545'],
                            }],
                          });
                        } catch (addError) {
                          console.error('Error adding network:', addError);
                        }
                      }
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Cambiar a red local"
                >
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Local</span>
                  </div>
                </button>
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  title="Desconectar"
                >
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4" />
                    </svg>
                    <span>Salir</span>
                  </div>
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
                  title="Agregar EURT a Wallet"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Agregar a Wallet</span>
                </button>
              </div>
            </div>
          </div>
          {euroBalance !== null ? (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Saldo EuroToken</p>
                  <p className="text-lg font-bold text-emerald-600 font-mono">
                    €{euroBalance}
                  </p>
                </div>
                <button
                  onClick={addTokenToWallet}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors text-xs font-medium border border-indigo-200"
                  title="Agregar EURT a Wallet"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Agregar a Wallet</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Saldo EuroToken</p>
                  <p className="text-lg font-bold text-emerald-600 font-mono">
                    Cargando...
                  </p>
                </div>
              </div>
            </div>
          )}

          {showNetworkSelector && (
            <div className="p-3 bg-white border border-gray-200 rounded-md shadow-sm space-y-2">
              <p className="text-xs font-medium text-gray-700">Seleccionar Red:</p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    // Simulando cambio a red local (Anvil)
                    console.log('Switching to network 31337');
                    setShowNetworkSelector;
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
