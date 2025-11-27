"use client";

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  clientSecret: string;
  walletAddress: string;
  amount: number;
  invoice?: string;
  redirectUrl?: string | null;
}

const Form = ({ clientSecret, walletAddress, amount, invoice, redirectUrl }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Error');
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      clientSecret,
      elements,
      confirmParams: {
        return_url: redirectUrl
          ? `${redirectUrl}?success=true&tokens=${amount}&invoice=${encodeURIComponent(invoice || '')}`
          : `${window.location.origin}/success?success=true&tokens=${amount}&invoice=${encodeURIComponent(invoice || '')}`,
      },
    });

    if (error) {
      setError(error.message || 'Error en el pago');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
      >
        {loading ? 'Procesando...' : `Pagar €${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default function CheckoutForm({
  clientSecret,
  walletAddress,
  amount,
  invoice,
  redirectUrl
}: {
  clientSecret: string;
  walletAddress: string;
  amount: number;
  invoice?: string;
  redirectUrl?: string | null;
}) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalles del Pago</h3>
      <Elements options={options} stripe={stripePromise}>
        <Form
          clientSecret={clientSecret}
          walletAddress={walletAddress}
          amount={amount}
          invoice={invoice}
          redirectUrl={redirectUrl}
        />
      </Elements>
    </div>
  );
}