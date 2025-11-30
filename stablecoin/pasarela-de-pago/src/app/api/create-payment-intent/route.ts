import { NextRequest, NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

/**
 * API Endpoint para crear Payment Intent de Stripe
 * 
 * Request Body:
 * {
 *   amount: number,
 *   walletAddress: string,
 *   invoice: string
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, walletAddress, invoice } = body;

        // Validar campos requeridos
        if (!amount || !walletAddress || !invoice) {
            console.error('[CREATE-PAYMENT-INTENT] Missing required fields:', { amount, walletAddress, invoice });
            return NextResponse.json(
                { error: 'Missing required fields: amount, walletAddress, invoice' },
                { status: 400 }
            );
        }

        // Validar que amount sea un número positivo
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            console.error('[CREATE-PAYMENT-INTENT] Invalid amount:', amount);
            return NextResponse.json(
                { error: 'Amount must be a positive number' },
                { status: 400 }
            );
        }

        console.log('[CREATE-PAYMENT-INTENT] Creating payment intent:', {
            amount: amountNum,
            walletAddress,
            invoice
        });

        // Crear Payment Intent en Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amountNum * 100), // Convertir a céntimos
            currency: 'eur',
            metadata: {
                walletAddress,
                invoice,
                timestamp: new Date().toISOString()
            },
            // Configurar para recibir webhook después del pago
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log('[CREATE-PAYMENT-INTENT] Payment intent created:', {
            id: paymentIntent.id,
            amount: paymentIntent.amount,
            status: paymentIntent.status
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error: any) {
        console.error('[CREATE-PAYMENT-INTENT] Error:', error);
        return NextResponse.json(
            { error: 'Error al crear el intento de pago', details: error.message },
            { status: 500 }
        );
    }
}
