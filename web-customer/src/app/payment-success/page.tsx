'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    const success = searchParams.get('success') === 'true';
    const tokens = searchParams.get('tokens');
    const invoice = searchParams.get('invoice');
    const txHash = searchParams.get('tx');

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                <div className="container mx-auto px-4 py-12 max-w-2xl">
                    <div className="bg-card rounded-2xl shadow-xl p-8 border border-border text-center">
                        <div className="mb-6">
                            <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                                <svg className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-4">Pago Cancelado o Fallido</h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            No se pudo completar tu compra de EuroTokens. No se ha realizado ningún cargo.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/buy-eurocoins"
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
                            >
                                Intentar de Nuevo
                            </Link>
                            <Link
                                href="/"
                                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-all"
                            >
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
                    {/* Success Icon */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-green-100 rounded-full mb-4 animate-bounce">
                            <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            ¡Compra Exitosa! 🎉
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Tus EuroTokens han sido enviados a tu billetera
                        </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-4 mb-8">
                        <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-muted-foreground">Cantidad Comprada</span>
                                <span className="text-3xl font-bold text-primary">
                                    {tokens || '0'} EURT
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground text-right">
                                1 EUR = 1 EURT
                            </p>
                        </div>

                        {invoice && (
                            <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">ID de Factura</span>
                                    <span className="text-sm font-mono text-foreground">{invoice}</span>
                                </div>
                            </div>
                        )}

                        {txHash && (
                            <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Transaction Hash</span>
                                    <div className="flex items-center gap-2">
                                        <code className="text-xs font-mono text-foreground bg-background px-3 py-2 rounded border border-border flex-1 overflow-hidden text-ellipsis">
                                            {txHash}
                                        </code>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(txHash)}
                                            className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded transition-all"
                                            title="Copiar"
                                        >
                                            📋
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Information Box */}
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl mb-8">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <span>ℹ️</span>
                            ¿Qué hacer ahora?
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Abre tu billetera <strong>MetaMask</strong> para verificar tus tokens EURT</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Puede que necesites <strong>refrescar</strong> tu balance en MetaMask</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Ahora puedes usar tus EURT para comprar productos en nuestra tienda</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all transform hover:scale-105 text-center shadow-lg"
                        >
                            🛍️ Ir a la Tienda
                        </Link>
                        <Link
                            href="/"
                            className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/90 transition-all text-center"
                        >
                            Volver al Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
