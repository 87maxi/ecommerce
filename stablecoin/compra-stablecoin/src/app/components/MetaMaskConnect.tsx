"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Props {
  onWalletConnected: (address: string) => void;
}

const MetaMaskConnect = ({ onWalletConnected }: Props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.warn("Wallet no detectada. Abriendo página de instalación.");
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);
        onWalletConnected(address);
        await updateBalance(address);
        // Intentar agregar el token automáticamente
        addTokenToWallet();
      }
    } catch (error) {
      console.error("Error al conectar con Wallet:", error);
    }
  };

  const updateBalance = async (address: string) => {
    try {
      const pasarelaUrl = process.env.NEXT_PUBLIC_PASARELA_PAGO_URL || 'http://localhost:3034';
      const response = await fetch(`${pasarelaUrl}/api/balance/${address}`);

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      } else {
        console.error("Error fetching balance:", await response.text());
        setBalance("error");
      }
    } catch (error) {
      console.error("Error al obtener saldo:", error);
      setBalance("error");
    }
  };

  const addTokenToWallet = async () => {
    if (!window.ethereum) return;

    try {
      const tokenAddress = process.env.NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS;
      if (!tokenAddress) {
        console.error("Contract address not found");
        return;
      }

      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
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
    const checkIfConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          setIsConnected(true);
          // Don't call onWalletConnected here - only when user clicks connect
          await updateBalance(address);
        }
      }
    };
    checkIfConnected();
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/50 rounded-2xl p-1 border border-slate-700/50 backdrop-blur-sm">
        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 py-4 px-6 rounded-xl font-bold text-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
            <div className="relative flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Conectar Wallet</span>
              <svg className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </div>
          </button>
        ) : (
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Wallet Conectada</p>
                  <p className="text-white font-mono font-bold tracking-wide text-sm">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Saldo</p>
                <p className={`font-mono font-bold text-sm ${balance === "error" ? "text-red-400" : "text-emerald-400"}`}>
                  {balance === "error" ? "Error" : `${balance} EURT`}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center">
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </span>
                <button
                  onClick={addTokenToWallet}
                  className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-900/20 px-2 py-0.5 rounded-full border border-indigo-500/20"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar EURT
                </button>
              </div>
              <button onClick={() => window.location.reload()} className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors">
                Desconectar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Continue button when wallet is already connected */}
      {isConnected && (
        <button
          onClick={() => onWalletConnected(walletAddress)}
          className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 py-4 px-6 rounded-xl font-bold text-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 skew-y-12"></div>
          <div className="relative flex items-center justify-center space-x-3">
            <span>Continuar al Pago</span>
            <svg className="w-5 h-5 opacity-70 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
};

export default MetaMaskConnect;
