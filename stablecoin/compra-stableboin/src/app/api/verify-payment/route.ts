import { NextRequest, NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentIntentId = searchParams.get('payment_intent');

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Missing payment_intent' }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      walletAddress: paymentIntent.metadata.walletAddress,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payment intent' }, { status: 404 });
  }
}