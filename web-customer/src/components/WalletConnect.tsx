'use client';

import { useState } from 'react';

export default function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
  };

  return (
    <div className="flex items-center gap-4">
      {isConnected ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-lg border border-border">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-3 py-1 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-destructive/20 hover:text-destructive transition-all duration-200 border border-border"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 border border-primary/20 shadow-lg hover:shadow-primary/20"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}