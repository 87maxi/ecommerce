import { NextRequest, NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { amount, walletAddress, invoice } = await request.json();

    if (!amount || !walletAddress) {
      return NextResponse.json(
        { error: 'Monto y dirección de billetera son requeridos' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Céntimos
      currency: 'eur',
      metadata: {
        walletAddress,
        invoice: invoice || `EURT_PURCHASE_${Date.now()}`,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error('Error creating Payment Intent:', err);
    return NextResponse.json(
      { error: 'Error al crear el intento de pago' },
      { status: 500 }
    );
  }
}