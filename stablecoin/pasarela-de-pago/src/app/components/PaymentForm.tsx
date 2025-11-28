"use client";

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentData {
  amount: string;
  walletAddress: string;
  invoice: string;
  redirectUrl: string;
}

function CheckoutForm({ paymentData }: { paymentData: PaymentData }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${paymentData.redirectUrl}?success=true&amount=${paymentData.amount}&wallet=${paymentData.walletAddress}&invoice=${paymentData.invoice}`,
      },
    });

    if (error) {
      setMessage(error.message || 'An error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Monto:</strong> €{paymentData.amount}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Recibirás:</strong> {paymentData.amount} EURT
        </p>
        <p className="text-sm text-gray-700">
          <strong>Billetera:</strong> {paymentData.walletAddress.slice(0, 6)}...{paymentData.walletAddress.slice(-4)}
        </p>
      </div>

      <PaymentElement />

      {message && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Procesando...' : `Pagar €${paymentData.amount}`}
      </button>
    </form>
  );
}

const PaymentForm = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amount = params.get('amount');
    const walletAddress = params.get('walletAddress');
    const invoice = params.get('invoice');
    const redirect = params.get('redirect');

    if (!amount || !walletAddress || !invoice || !redirect) {
      setError('Parámetros inválidos. Se requieren: amount, walletAddress, invoice, redirect');
      setLoading(false);
      return;
    }

    const data: PaymentData = { amount, walletAddress, invoice, redirectUrl: redirect };
    setPaymentData(data);

    // Create payment intent
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount), walletAddress, invoice }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Error al crear la intención de pago');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Preparando pago...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto">
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!clientSecret || !paymentData) return null;

  const options = { clientSecret };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Completar Pago</h2>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm paymentData={paymentData} />
      </Elements>
    </div>
  );
};

export default PaymentForm;