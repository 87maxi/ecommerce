"use client";

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Tipos
interface PaymentData {
  amount: string;
  invoice: string;
  redirectUrl: string | null;
}

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Error processing payment');
      setProcessing(false);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: paymentData?.redirectUrl ? `${paymentData.redirectUrl}?success=true&status=confirmed` : `${process.env.NEXT_PUBLIC_COMPRAS_STABLEBOIN_URL || 'http://localhost:3033'}?success=true&status=confirmed`, // Redirección a compras-stableboin
      },
    });

    if (result.error) {
      setError(result.error.message || 'Payment failed');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
      >
        {processing ? 'Procesando...' : 'Pagar ahora'}
      </button>
    </form>
  );
};

const PaymentForm = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

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

    // Simular creación de intención de pago
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount) * 100 }), // Cents
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(err => {
        console.error(err);
        alert('Error al iniciar pago');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (!clientSecret) return <p>Error al cargar forma de pago.</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Pago de {paymentData?.invoice}</h2>
      <p className="text-gray-600 mb-6">Monto: ${paymentData?.amount}</p>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
};

export default PaymentForm;