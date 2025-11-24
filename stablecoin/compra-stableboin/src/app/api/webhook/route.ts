import { NextRequest, NextResponse } from 'next/server';

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
    const amount = paymentIntent.amount / 100; // EUR

    // Llamar a mintTokens
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/mint-tokens', {
        method: 'POST',
        body: JSON.stringify({ walletAddress, amount }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to mint tokens');
      }

      console.log(`Tokens minted successfully for payment ${paymentIntent.id}`);
    } catch (error) {
      console.error('Error minting tokens:', error);
      return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}