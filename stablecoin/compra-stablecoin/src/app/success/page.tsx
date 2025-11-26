"use client";

import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wallet = params.get('wallet');
    const amount = params.get('amount');

    if (wallet && amount) {
      setPayment({ wallet, amount });
    }
  }, []);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-700">¡Pago Exitoso! ✅</h1>
        {payment ? (
          <div className="mt-4 text-left text-gray-700">
            <p><strong>Monto:</strong> €{payment.amount}</p>
            <p><strong>Enviado a:</strong> {payment.wallet.slice(0, 6)}...{payment.wallet.slice(-4)}</p>
            <p className="text-sm text-gray-500 mt-2">Tokens EURT enviados correctamente.</p>
          </div>
        ) : (
          <p className="text-gray-500">Cargando detalles...</p>
        )}
      </div>
    </div>
  );
}