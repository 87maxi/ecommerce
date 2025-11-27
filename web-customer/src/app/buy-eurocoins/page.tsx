'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function BuyEuroCoins() {
    const searchParams = useSearchParams();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        // Get amount from query params or use default
        const amount = searchParams.get('amount') || '100';

        // Generate unique invoice ID
        const invoice = `EUROCOIN_${Date.now()}`;

        // Set redirect URL to come back to web-customer
        const redirectUrl = `${window.location.origin}/payment-success`;

        // Get pasarela URL from env or use default
        const pasarelaUrl = process.env.NEXT_PUBLIC_PASARELA_PAGO_URL || 'http://localhost:3034';

        // Build redirect URL with parameters
        const targetUrl = `${pasarelaUrl}?amount=${amount}&invoice=${invoice}&redirect=${encodeURIComponent(redirectUrl)}`;

        setRedirecting(true);

        // Redirect after a short delay to show loading state
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 500);
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20">
            <div className="text-center p-8 bg-card rounded-2xl border border-border shadow-xl max-w-md">
                <div className="mb-6">
                    <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                        <svg
                            className="animate-spin h-12 w-12 text-primary"
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
                <h1 className="text-2xl font-bold text-foreground mb-2">
                    Redirigiendo a Pasarela de Pago...
                </h1>
                <p className="text-muted-foreground">
                    Serás redirigido al sistema de pago seguro para completar tu compra de EuroTokens.
                </p>
                {redirecting && (
                    <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border">
                        <p className="text-sm text-muted-foreground">
                            💳 Preparando tu sesión de pago...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
