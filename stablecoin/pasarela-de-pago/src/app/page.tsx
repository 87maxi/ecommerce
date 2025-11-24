"use client";

import PaymentForm from './components/PaymentForm';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pasarela de Pago con Stripe</h1>
          <p className="text-gray-600 mt-2">Procesa pagos seguros mediante tarjeta de crédito.</p>
        </header>
        <PaymentForm />
      </div>
    </div>
  );
}