"use client";

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface Props {
  onWalletConnected: (address: string) => void;
}

const MetaMaskConnect = ({ onWalletConnected }: Props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0');

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask no está instalado');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);
        onWalletConnected(address);
        await updateBalance(address);
      }
    } catch (error) {
      console.error('Error al conectar con MetaMask:', error);
    }
  };

  const updateBalance = async (address: string) => {
    try {
      // Esto requiere el ABI del contrato EuroToken
      const provider = new ethers.BrowserProvider(window.ethereum);
      // const contract = new ethers.Contract(EUROTOKEN_ADDRESS, EUROTOKEN_ABI, provider);
      // const balanceBN = await contract.balanceOf(address);
      // const formatted = ethers.formatUnits(balanceBN, 18);
      // setBalance(formatted);

      // Por ahora simulamos
      setBalance('0');
    } catch (error) {
      console.error('Error al obtener saldo:', error);
      setBalance('error');
    }
  };

  useEffect(() => {
    const checkIfConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          setIsConnected(true);
          onWalletConnected(address);
          await updateBalance(address);
        }
      }
    };
    checkIfConnected();
  }, [onWalletConnected]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Conectar Billetera</h3>
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Conectar MetaMask
        </button>
      ) : (
        <div>
          <p className="text-green-600 font-medium">Conectado: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          <p className="text-sm text-gray-500 mt-1">Saldo EURT: {balance} EURT</p>
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnect;