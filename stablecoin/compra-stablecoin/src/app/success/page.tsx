"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Trigger confetti animation
    setShowConfetti(true);

    // Check if we should redirect to a custom URL (from web-customer)
    const storedRedirect = sessionStorage.getItem('redirect_url');
    const storedInvoice = sessionStorage.getItem('invoice');
    const storedAmount = sessionStorage.getItem('amount');

    // Get params from URL (Stripe return)
    const urlWallet = params.get('wallet');
    const urlTokens = params.get('tokens');
    const urlInvoice = params.get('invoice');

    if (storedRedirect) {
      // Payment was successful, redirect back to web-customer
      setRedirecting(true);

      const finalAmount = storedAmount || urlTokens || '0';
      const finalInvoice = storedInvoice || urlInvoice || '';

      const redirectUrl = `${storedRedirect}?success=true&tokens=${finalAmount}&invoice=${finalInvoice}`;

      // Clean up session storage
      sessionStorage.removeItem('redirect_url');
      sessionStorage.removeItem('invoice');
      sessionStorage.removeItem('amount');

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);

      setPayment({ amount: finalAmount, invoice: finalInvoice });
      return;
    }

    // Fallback: show local success page
    const wallet = params.get('wallet');
    const tokens = params.get('tokens');

    if (wallet && tokens) {
      setPayment({ wallet, amount: tokens });
    }
  }, []);

  if (redirecting) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center relative overflow-hidden animate-in zoom-in duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>

          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
            <div className="relative inline-block p-4 bg-slate-900/50 rounded-full border border-emerald-500/30">
              <svg className="animate-spin h-12 w-12 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">¡Pago Exitoso!</h1>
          <p className="text-slate-400">Redirigiendo a la tienda...</p>

          {payment && (
            <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Tokens adquiridos</span>
                <span className="text-emerald-400 font-mono font-bold">{payment.amount} EURT</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#6366f1', '#a855f7', '#06b6d4', '#10b981'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}


      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center relative overflow-hidden animate-in zoom-in duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>

        {/* Success Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
          <div className="relative inline-block p-4 bg-slate-900/50 rounded-full border border-emerald-500/30 animate-in zoom-in duration-700">
            <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">¡Pago Exitoso!</h1>
        <p className="text-slate-400 mb-8">La transacción se ha completado correctamente.</p>

        {payment ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-slate-400 text-sm">Monto Total</span>
                <span className="text-white font-mono font-bold text-lg">€{payment.amount}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 text-sm">Tokens Recibidos</span>
                <span className="text-emerald-400 font-mono font-bold text-lg">{payment.amount} EURT</span>
              </div>
            </div>

            <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <p className="text-xs text-indigo-300 mb-1">Enviado a la billetera</p>
              <p className="font-mono text-sm text-indigo-200 break-all">{payment.wallet}</p>
            </div>

            <p className="text-xs text-slate-500 mt-4">
              Los tokens deberían aparecer en tu billetera en unos momentos.
            </p>
          </div>
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-slate-700/50 rounded-xl"></div>
            <div className="h-12 bg-slate-700/50 rounded-lg"></div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}