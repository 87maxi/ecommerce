"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

interface Props {
  onWalletConnected: (address: string) => void;
}

const MetaMaskConnect = ({ onWalletConnected }: Props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.warn("MetaMask no detectado. Abriendo página de instalación.");
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
      }
    } catch (error) {
      console.error("Error al conectar con MetaMask:", error);
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
      setBalance("0");
    } catch (error) {
      console.error("Error al obtener saldo:", error);
      setBalance("error");
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
    <div className="bg-white rounded-xl p-6 shadow-md mb-6 border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Conectar Billetera
        </h3>
      </div>
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span>Conectar MetaMask</span>
          </div>
        </button>
      ) : (
        <div>
          <div className="space-y-1">
            <p className="text-green-600 font-medium flex items-center">
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Conectado: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Saldo EURT:</span>{" "}
              {balance === "error" ? "Error" : `${balance} EURT`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnect;
