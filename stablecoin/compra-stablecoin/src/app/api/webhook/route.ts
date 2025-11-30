import { NextRequest, NextResponse } from 'next/server';
import { mintTokens } from '@/lib/minting';

// Este endpoint recibe eventos de webhook de Stripe
// Debe estar protegido y verificado con la firma del evento

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  const payload = await request.text();

  let event;

  try {
    event = require('stripe').webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Error verifying webhook signature: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Manejar evento
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const walletAddress = paymentIntent.metadata.walletAddress;
    const invoice = paymentIntent.metadata.invoice;
    const amount = paymentIntent.amount / 100; // EUR

    // Llamar a mintTokens
    try {
      await mintTokens(walletAddress, amount, invoice);
      console.log(`Tokens minted successfully for payment ${paymentIntent.id}`);
    } catch (error) {
      console.error('Error minting tokens:', error);
      return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}