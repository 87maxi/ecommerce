"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Check if we should redirect to a custom URL (from web-customer)
    const storedRedirect = sessionStorage.getItem('redirect_url');
    const storedInvoice = sessionStorage.getItem('invoice');
    const storedAmount = sessionStorage.getItem('amount');

    if (storedRedirect && storedInvoice && storedAmount) {
      // Payment was successful, redirect back to web-customer
      setRedirecting(true);

      const redirectUrl = `${storedRedirect}?success=true&tokens=${storedAmount}&invoice=${storedInvoice}`;

      // Clean up session storage
      sessionStorage.removeItem('redirect_url');
      sessionStorage.removeItem('invoice');
      sessionStorage.removeItem('amount');

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);

      setPayment({ amount: storedAmount, invoice: storedInvoice });
      return;
    }

    // Fallback: show local success page
    const wallet = params.get('wallet');
    const amount = params.get('amount');

    if (wallet && amount) {
      setPayment({ wallet, amount });
    }
  }, []);

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <svg className="animate-spin h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">¡Pago Exitoso! ✅</h1>
          <p className="text-gray-600">Redirigiendo a la tienda...</p>
          {payment && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Tokens:</strong> {payment.amount} EURT
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

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