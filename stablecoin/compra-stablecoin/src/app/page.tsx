"use client";

import EuroTokenPurchase from './components/EuroTokenPurchase';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Compra EuroToken (EURT)
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Adquiere tokens EuroToken 1:1 con euros utilizando tu tarjeta de crédito.
            Los tokens serán enviados directamente a tu billetera MetaMask.
          </p>
        </div>
        
        <div className="flex justify-center">
          <EuroTokenPurchase />
        </div>
      </div>
    </div>
  );
}