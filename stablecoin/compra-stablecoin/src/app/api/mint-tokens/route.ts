import { NextRequest, NextResponse } from 'next/server';
import { mintTokens } from '@/lib/minting';
import { ethers } from 'ethers';

/**
 * API Endpoint para mintear EuroTokens
 * Este endpoint es llamado por pasarela-de-pago después de un pago exitoso
 * 
 * Request Body:
 * {
 *   walletAddress: string,
 *   amount: number,
 *   invoice: string,
 *   paymentIntentId: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, amount, invoice, paymentIntentId } = body;

    // Validar campos requeridos
    if (!walletAddress || !amount || !invoice) {
      console.error('Missing required fields:', { walletAddress, amount, invoice });
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: walletAddress, amount, invoice'
        },
        { status: 400 }
      );
    }

    // Validar que walletAddress sea una dirección válida de Ethereum
    if (!ethers.isAddress(walletAddress)) {
      console.error('Invalid wallet address:', walletAddress);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Ethereum wallet address'
        },
        { status: 400 }
      );
    }

    // Validar que amount sea un número positivo
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      console.error('Invalid amount:', amount);
      return NextResponse.json(
        {
          success: false,
          error: 'Amount must be a positive number'
        },
        { status: 400 }
      );
    }

    const result = await mintTokens(walletAddress, amountNum, invoice);

    return NextResponse.json({
      success: true,
      message: `Successfully minted ${amountNum} EURT to ${walletAddress}`,
      data: {
        ...result,
        paymentIntentId
      }
    });

  } catch (error: any) {
    console.error('[MINT-TOKENS] Error minting tokens:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to mint tokens',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}