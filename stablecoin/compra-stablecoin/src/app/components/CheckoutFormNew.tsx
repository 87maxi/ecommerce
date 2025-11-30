"use client";

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import PaymentSummary from './PaymentSummary';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setIsProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Error al procesar los datos de pago');
      setLoading(false);
      setIsProcessing(false);
      return;
    }

    setError(null);

    const { error } = await stripe.confirmPayment({
      clientSecret,
      elements,
      confirmParams: {
        return_url: redirectUrl
          ? `${redirectUrl}?success=true&tokens=${amount}&invoice=${encodeURIComponent(invoice || '')}&wallet=${walletAddress}`
          : `${window.location.origin}/success?success=true&tokens=${amount}&invoice=${encodeURIComponent(invoice || '')}&wallet=${walletAddress}`,
      },
    });

    if (error) {
      setError(error.message || 'Error en el pago');
      setIsProcessing(false);
      setIsPaymentComplete(false);
    } else {
      setIsPaymentComplete(true);
    }

    setLoading(false);
  };

  // Estados del botón
  const getButtonState = () => {
    if (!stripe) return 'Cargando...';
    if (isProcessing) return 'Verificando pago...';
    if (loading) return 'Procesando...';
    if (isPaymentComplete) return 'Pago completado';
    return `Pagar €${amount.toFixed(2)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <PaymentSummary
        amount={amount}
        walletAddress={walletAddress}
        {...(invoice ? { invoice } : {})}
      />

      {/* Formulario de pago con Stripe */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/40 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center space-x-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h4 className="text-base font-semibold text-white">Detalles de la tarjeta</h4>
          <div className="flex-1 flex justify-end">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <PaymentElement
            options={{
              layout: 'accordion',
              paymentMethodOrder: ['card']
            }}
          />
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-300 rounded-xl text-sm flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Botón de pago */}
      <button
        type="submit"
        disabled={!stripe || loading || isProcessing || isPaymentComplete}
        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:shadow-none"
      >
        {getButtonState()}
      </button>
    </form>
  );
};

const CheckoutFormNew = (props: CheckoutFormProps) => {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret: props.clientSecret }}>
      <Form {...props} />
    </Elements>
  );
};

export default CheckoutFormNew;
