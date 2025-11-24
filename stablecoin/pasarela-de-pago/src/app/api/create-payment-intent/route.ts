import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

// Simular base de datos con turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Configuración de Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json(); // Monto en centavos

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error('Error creating PaymentIntent:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}