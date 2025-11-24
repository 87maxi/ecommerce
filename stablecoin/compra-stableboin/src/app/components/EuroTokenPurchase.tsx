"use client";

import { useState, useEffect } from 'react';
import MetaMaskConnect from './MetaMaskConnect';
import CheckoutForm from './CheckoutForm';

export default function EuroTokenPurchase() {
  const [amount, setAmount] = useState<number>(100);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [step, setStep] = useState<'connect' | 'pay' | 'success'>('connect');

  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
    setStep('pay');
  };

  useEffect(() => {
    if (!walletAddress || !amount) return;

    fetch('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, walletAddress }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => console.error('Error:', err));
  }, [walletAddress, amount]);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Compra EURT</h2>
          <p className="text-gray-600 mt-2">1 EUR = 1 EURT</p>
        </div>

        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Monto (€)
          </label>
          <input
            id="amount"
            type="number"
            min="10"
            max="10000"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 10)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="100"
          />
          <p className="text-sm text-gray-500 mt-1 text-right">
            Recibirás <strong>{amount} EURT</strong>
          </p>
        </div>

        {step === 'connect' && <MetaMaskConnect onWalletConnected={handleWalletConnected} />}

        {step === 'pay' && clientSecret && walletAddress && (
          <CheckoutForm clientSecret={clientSecret} walletAddress={walletAddress} amount={amount} />
        )}
      </div>
    </div>
  );
}