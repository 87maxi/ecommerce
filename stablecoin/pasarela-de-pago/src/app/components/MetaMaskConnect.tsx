"use client";

import { useState, useEffect } from 'react';
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
            }
        } catch (error) {
            console.error("Error al conectar con MetaMask:", error);
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
                }
            }
        };
        checkIfConnected();
    }, []);

    return (
        <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-700 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg
                        className="w-5 h-5 mr-2 text-indigo-400"
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
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 py-3 px-6 rounded-xl font-medium transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
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
                        <p className="text-emerald-400 font-medium flex items-center bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/30">
                            <svg
                                className="w-4 h-4 mr-2"
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
                            Conectado: <span className="font-mono ml-2 text-white">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetaMaskConnect;
