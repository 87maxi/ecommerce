"use client";

import { useState } from 'react';
import MetaMaskConnect from './MetaMaskConnect';

export default function EuroTokenPurchase() {
  const [amount, setAmount] = useState<number>(100);

  const handleWalletConnected = (address: string) => {
    console.log('Wallet connected:', address);

    // Redirect to payment gateway with parameters
    const pasarelaUrl = process.env.NEXT_PUBLIC_PASARELA_PAGO_URL || 'http://localhost:3034';
    const webCustomerUrl = process.env.NEXT_PUBLIC_WEB_CUSTOMER_URL || 'http://localhost:3031';

    const params = new URLSearchParams({
      amount: amount.toString(),
      walletAddress: address,
      redirect: webCustomerUrl,
      invoice: `EURT_PURCHASE_${Date.now()}`
    });

    const finalUrl = `${pasarelaUrl}?${params.toString()}`;
    console.log('Redirecting to:', finalUrl);
    console.log('Params:', {
      amount: amount.toString(),
      walletAddress: address,
      redirect: webCustomerUrl,
      invoice: `EURT_PURCHASE_${Date.now()}`
    });

    window.location.href = finalUrl;
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Compra EURT</h2>
          <p className="text-gray-600 mt-2">1 EUR = 1 EURT</p>
          <p className="text-xs text-gray-400 mt-1">v2.0 - Nueva versión</p>
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

        <MetaMaskConnect onWalletConnected={handleWalletConnected} />
      </div>
    </div>
  );
}