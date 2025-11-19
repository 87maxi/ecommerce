'use client';

import { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import TransactionList from './components/TransactionList';
import StatsCard from './components/StatsCard';

export default function Home() {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const handleConnect = (address: string) => {
    setConnectedAddress(address);
  };

  const handleDisconnect = () => {
    setConnectedAddress(null);
  };

  return (
    <div className="container py-8">
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <h1 className="text-2xl font-bold">Blockchain Admin</h1>
          </div>
          <WalletConnect onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatsCard 
            title="Transactions" 
            value={142} 
            description="Monitor and manage all blockchain transactions" 
            color="success" 
          />
          <StatsCard 
            title="Users" 
            value={1284} 
            description="Manage user accounts and permissions" 
            color="primary" 
          />
          <StatsCard 
            title="Revenue" 
            value="24.8 ETH" 
            description="Track earnings and financial metrics" 
            color="warning" 
          />
        </div>

        <TransactionList 
          transactions={[
            { id: '0x8a1...d2e4', user: 'Alice', amount: '0.5 ETH', status: 'confirmed', time: '2 min ago' },
            { id: '0x3b2...f7a1', user: 'Bob', amount: '1.2 ETH', status: 'pending', time: '15 min ago' },
            { id: '0x1c3...e8b2', user: 'Charlie', amount: '0.8 ETH', status: 'failed', time: '1 hour ago' }
          ]} 
        />

        {connectedAddress && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Connected Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Address</h3>
                <p className="font-mono text-sm break-all bg-card/50 p-2 rounded">{connectedAddress}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Network</h3>
                <p className="bg-secondary text-black px-2 py-1 rounded inline-block">Ethereum Local (Chain ID: 31337)</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-foreground/70 text-sm">© 2025 Blockchain E-Commerce Admin</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Docs</a>
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">API</a>
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}