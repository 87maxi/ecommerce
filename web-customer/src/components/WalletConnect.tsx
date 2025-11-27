'use client';

import { useWallet } from '@/hooks/useWallet';

export default function WalletConnect() {
  const expectedChainId = process.env.NEXT_PUBLIC_EXPECTED_CHAIN_ID || '0x7a69'; // Default to Anvil chain ID
  const { isConnected, account, error, connectWallet, disconnectWallet, chainId } = useWallet();

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
      {error && (
        <div className="text-destructive text-sm">
          {error}
        </div>
      )}
      {chainId && expectedChainId !== chainId && (
        <div className="mt-2 p-2 bg-warning/10 border border-warning rounded-lg text-warning text-sm">
          Connected to wrong network. Please switch to chain ID: {expectedChainId}
          <button
            onClick={async () => {
              try {
                await window.ethereum?.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: expectedChainId }],
                });
              } catch (switchError) {
                // If the network isn't added, add it
                if (typeof switchError === 'object' && switchError !== null && 'code' in switchError && switchError.code === 4902) {
                  await window.ethereum?.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                      chainId: expectedChainId,
                      chainName: 'Local Anvil',
                      nativeCurrency: {
                        name: 'Ether',
                        symbol: 'ETH',
                        decimals: 18
                      },
                      rpcUrls: ['http://localhost:8545']
                    }],
                  });
                }
              }
            }}
            className="ml-2 text-warning underline font-medium hover:text-warning/80"
          >
            Switch Network
          </button>
        </div>
      )}
      {error && (
        <div className="text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  );
}