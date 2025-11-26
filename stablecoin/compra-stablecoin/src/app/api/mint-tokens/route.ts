import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Este endpoint será llamado por el webhook, no directamente por el frontend
// Por seguridad, no debe exponerse como GET ni permitirse CORS
import EuroTokenABI from '@/lib/EuroTokenABI';

export async function POST(request: NextRequest) {
  try {
    // Extraer los datos del webhook de Stripe
    const stripeSignature = request.headers.get('stripe-signature');
    const payload = await request.text();
    
    if (!stripeSignature) {
      console.error('Falta la firma de Stripe');
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }
    
    // Process the Stripe event
    let event;
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);
      event = stripe.webhooks.constructEvent(
        payload,
        stripeSignature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error(`Error verifying webhook signature: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Extraer los datos del evento
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const walletAddress = paymentIntent.metadata.walletAddress;
      const amount = paymentIntent.amount / 100; // Convertir de céntimos a euros

      console.log(`Minting tokens for ${walletAddress}: ${amount} EUR`);

    // Conexión a la red local (anvil)
      // Conexión a la red local (anvil)
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY!, provider);

      if (!process.env.NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS) {
        return NextResponse.json({ error: 'Contract address not configured' }, { status: 500 });
      }

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS!,
        EuroTokenABI,
        wallet
      );

      const tx = await contract.mint(walletAddress, ethers.parseUnits(amount.toString(), 18));
      const receipt = await tx.wait();

      console.log(`Tokens minted successfully. Hash: ${receipt?.hash}`);

      return NextResponse.json({
        success: true,
        message: `Tokens minteados exitosamente para ${walletAddress}`,
        transactionHash: receipt?.hash
      });
    }

    // Return a response for other event types
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error minteando tokens:', error);
    return NextResponse.json(
      { error: 'Failed to mint tokens' }, 
      { status: 500 }
    );
  }
}