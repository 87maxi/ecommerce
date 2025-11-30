import { NextRequest, NextResponse } from 'next/server';
import { verifyTransfer } from '@/lib/eurt';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { txHash, expectedAmount, expectedRecipient } = body;

        if (!txHash || !expectedAmount || !expectedRecipient) {
            return NextResponse.json(
                { error: 'Missing required fields: txHash, expectedAmount, expectedRecipient' },
                { status: 400 }
            );
        }

        const result = await verifyTransfer(txHash, expectedAmount, expectedRecipient);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error verifying transaction:', error);
        return NextResponse.json(
            { error: 'Failed to verify transaction' },
            { status: 500 }
        );
    }
}
