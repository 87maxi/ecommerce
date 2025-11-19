'use client';

import { useState, useEffect } from 'react';
import type { EIP1193Provider } from 'ethers';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if MetaMask is installed and ethereum object exists
    if (typeof window !== 'undefined' && window.ethereum) {
      const ethereum = window.ethereum as EIP1193Provider;
      
      // Check for existing connection
      checkExistingConnection();
      
      // Listen for account changes
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('disconnect', handleDisconnect);
      
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
        ethereum.removeListener('disconnect', handleDisconnect);
      };
    } else {
      // Don't set error immediately, allow user to see connect button and try
      // setError('MetaMask is not installed. Please install MetaMask to use this application.');
    }
  }, []);

  const checkExistingConnection = async () => {
    try {
      const ethereum = window.ethereum as EIP1193Provider;
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      
      if (Array.isArray(accounts) && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setChainId(chainId);
        onConnect(accounts[0]);
      }
    } catch (err) {
      console.error('Error checking existing connection:', err);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      onConnect(accounts[0]);
    } else {
      setWalletAddress(null);
      onDisconnect();
    }
  };

  const handleChainChanged = (chainId: string) => {
    setChainId(chainId);
    // Optionally handle chain changes, like showing a warning if not on expected network
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setChainId(null);
    onDisconnect();
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to use this application.');
      return;
    }

    setIsConnecting(true);
    setError(null);
    
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });
      
      if (Array.isArray(accounts) && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setChainId(chainId);
        onConnect(accounts[0]);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to connect to wallet');
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    setWalletAddress(null);
    setChainId(null);
    onDisconnect();
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex flex-col space-y-4">
      {!walletAddress ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="connect-wallet-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>{formatAddress(walletAddress)}</span>
          </div>
          {chainId && (
            <span className="network-badge">Chain: {parseInt(chainId, 16)}</span>
          )}
          <button
            onClick={disconnectWallet}
            className="btn btn-outline text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
      
      {error && (
        <div className="text-danger text-sm bg-danger/10 border border-danger/20 rounded p-2">
          {error}
        </div>
      )}
    </div>
  );
}