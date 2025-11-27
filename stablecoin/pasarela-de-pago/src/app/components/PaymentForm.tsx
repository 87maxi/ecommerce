"use client";

import { useEffect, useState } from 'react';

// Tipos
interface PaymentData {
  amount: string;
  invoice: string;
  redirectUrl: string | null;
}

const PaymentForm = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amount = params.get('amount');
    const invoice = params.get('invoice');
    const redirect = params.get('redirect');

    if (!amount || !invoice) {
      alert('Parámetros inválidos: se requieren amount e invoice');
      setLoading(false);
      return;
    }

    setPaymentData({ amount, invoice, redirectUrl: redirect });

    // Redirect to compra-stablecoin instead of processing payment here
    const compraUrl = process.env.NEXT_PUBLIC_COMPRAS_STABLEBOIN_URL || 'http://localhost:3033';
    const targetUrl = `${compraUrl}?amount=${amount}&invoice=${invoice}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`;

    setRedirecting(true);

    // Redirect after showing loading state
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 1000);
  }, []);

  if (loading || redirecting) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Redirigiendo...</h2>
        <p className="text-gray-600">Serás redirigido al sistema de compra de stablecoins.</p>
        {paymentData && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Factura:</strong> {paymentData.invoice}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Monto:</strong> ${paymentData.amount}
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default PaymentForm;