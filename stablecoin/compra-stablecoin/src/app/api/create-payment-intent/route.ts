import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { amount, walletAddress, invoice } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Céntimos
      currency: 'eur',
      metadata: {
        walletAddress,
        invoice: invoice || 'STABLECOIN_PURCHASE',
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