"use client";

import { useState, useEffect } from 'react';
import MetaMaskConnect from './MetaMaskConnect';
import PurchaseSteps from './PurchaseSteps';
import AmountSelector from './AmountSelector';

export default function EuroTokenPurchase() {
  // State for amount to purchase in euros
  const [amount, setAmount] = useState<number>(100);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Check for URL parameters (from web-customer redirection)
    const params = new URLSearchParams(window.location.search);
    const urlAmount = params.get('amount');
    const urlInvoice = params.get('invoice');
    const urlRedirect = params.get('redirect');

    if (urlAmount) {
      const parsedAmount = parseFloat(urlAmount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        setAmount(parsedAmount);
      }
    }

    if (urlRedirect) {
      sessionStorage.setItem('redirect_url', urlRedirect);
    }

    if (urlInvoice) {
      sessionStorage.setItem('invoice', urlInvoice);
    }

    if (urlAmount) {
      sessionStorage.setItem('amount', urlAmount);
    }
  }, []);

  const handleWalletConnected = async (address: string) => {
    console.log('Wallet connected:', address);
    setWalletAddress(address);

    // Store wallet address for verification
    sessionStorage.setItem('wallet_address', address);

    // Show processing state
    setCurrentStep(3); // Processing step
    
    // Redirect to pasarela-de-pago for payment processing
    const pasarelaUrl = process.env.NEXT_PUBLIC_PASARELA_PAGO_URL || 'http://localhost:3034';
    const redirectUrl = sessionStorage.getItem('redirect_url') || '';
    const invoice = sessionStorage.getItem('invoice') || '';

    // Build redirect URL with parameters
    const params = new URLSearchParams({
      amount: amount.toString(),
      walletAddress: address,
      ...(redirectUrl && { redirect: redirectUrl }),
      ...(invoice && { invoice: invoice })
    });

    // Add a small delay to show the processing state
    setTimeout(() => {
      window.location.href = `${pasarelaUrl}?${params.toString()}`;
    }, 1000);
  };

  const handleReset = () => {
    setWalletAddress(null);
    setError(null);
    setCurrentStep(1);
  };

  const handleContinueToWallet = () => {
    if (amount >= 10 && amount <= 10000) {
      setCurrentStep(2);
      setError(null);
    } else {
      setError('Por favor selecciona un monto válido entre €10 y €10,000');
    }
  };


  // Step 3: Processing Payment
  if (currentStep === 3) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 sm:px-0 animate-in fade-in duration-500">
        <PurchaseSteps currentStep={3} />

        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 shadow-[0_0_50px_rgba(99,102,241,0.15)] rounded-3xl p-6 sm:p-8 space-y-8 transition-all duration-500 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-50"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

          <div className="text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-300 tracking-tight mb-6">
              Procesando tu Pago
            </h2>
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-900/30 flex items-center justify-center border border-indigo-500/30 animate-pulse">
                <svg className="w-8 h-8 text-indigo-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            
            <p className="text-slate-400 font-medium text-sm sm:text-base mt-3 max-w-md mx-auto">
              Estamos procesando tu pago seguro. Serás redirigido en breve...
            </p>
            
            <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <span className="text-sm text-slate-400">Comprando:</span>
              <div className="flex items-center gap-2">
                <strong className="text-emerald-400 text-lg font-mono">{amount} EURT</strong>
                <span className="text-slate-500">≈</span>
                <span className="text-white font-mono">€{amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Wallet Connection
  if (currentStep === 2) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 sm:px-0 animate-in fade-in duration-500">
        <PurchaseSteps currentStep={currentStep} />

        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 shadow-[0_0_50px_rgba(99,102,241,0.15)] rounded-3xl p-6 sm:p-8 space-y-8 transition-all duration-500 hover:shadow-[0_0_80px_rgba(99,102,241,0.25)] hover:border-indigo-500/30 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-50"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

          <button
            onClick={() => setCurrentStep(1)}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors group relative z-10"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Cambiar monto
          </button>

          <div className="text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-300 tracking-tight">
              Conecta tu Wallet
            </h2>
            <p className="text-slate-400 font-medium text-sm sm:text-base mt-3">
              Los tokens serán enviados a tu billetera MetaMask
            </p>

            {/* Amount Reminder */}
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <span className="text-sm text-slate-400">Comprando:</span>
              <div className="flex items-center gap-2">
                <strong className="text-emerald-400 text-lg font-mono">{amount} EURT</strong>
                <span className="text-slate-500">≈</span>
                <span className="text-white font-mono">€{amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-300 rounded-xl text-sm text-center relative z-10">
              {error}
            </div>
          )}

          <div className="relative z-10">
            <MetaMaskConnect onWalletConnected={handleWalletConnected} />
          </div>
          
          {/* Progress indicator */}
          <div className="mt-6 pt-6 border-t border-slate-800 relative z-10">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Paso 1: Monto</span>
              <span className="text-indigo-400 font-medium">Paso 2: Wallet</span>
              <span>Paso 3: Pago</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6 max-w-xs mx-auto">
          Al conectar tu wallet, aceptas los <a href="#" className="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/30">Términos de Servicio</a> y la <a href="#" className="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/30">Política de Privacidad</a>.
        </p>
      </div>
    );
  }

  // Step 1: Amount Selection
  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-0 animate-in fade-in duration-500">
      <PurchaseSteps currentStep={currentStep} />

      <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 shadow-[0_0_50px_rgba(99,102,241,0.15)] rounded-3xl p-6 sm:p-8 space-y-8 transition-all duration-500 hover:shadow-[0_0_80px_rgba(99,102,241,0.25)] hover:border-indigo-500/30 relative overflow-hidden group">

        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-50"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>

        <div className="text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-300 tracking-tight">
            Compra EURT
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <p className="text-slate-400 font-medium text-sm sm:text-base">1 EUR = 1 EURT</p>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="text-[10px] text-cyan-300 font-mono bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-500/30 uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              Stablecoin
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <AmountSelector
            amount={amount}
            onChange={setAmount}
            min={10}
            max={10000}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-300 rounded-xl text-sm text-center relative z-10 animate-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <div className="relative z-10">
          <button
            onClick={handleContinueToWallet}
            disabled={amount < 10 || amount > 10000}
            className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-800 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:shadow-none transition-all duration-300 py-4 px-6 rounded-xl font-bold text-lg transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 skew-y-12"></div>
            <div className="relative flex items-center justify-center space-x-3">
              <span>Continuar</span>
              <svg className="w-5 h-5 opacity-70 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
          
          {/* Progress indicator */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span className="text-indigo-400 font-medium">Paso 1: Monto</span>
              <span>Paso 2: Wallet</span>
              <span>Paso 3: Pago</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-slate-500 text-xs mt-6 max-w-xs mx-auto">
        Al continuar, aceptas los <a href="#" className="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/30">Términos de Servicio</a> y la <a href="#" className="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/30">Política de Privacidad</a> de EuroToken.
      </p>
    </div>
  );
}
