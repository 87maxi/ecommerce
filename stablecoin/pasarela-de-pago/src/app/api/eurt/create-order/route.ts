import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { orders } from '@/lib/orderStorage';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, quantity, buyerAddress, totalAmount } = body;

        if (!productId || !quantity || !buyerAddress || !totalAmount) {
            return NextResponse.json(
                { error: 'Missing required fields: productId, quantity, buyerAddress, totalAmount' },
                { status: 400 }
            );
        }

        const orderId = randomUUID();
        const tokenAmount = totalAmount; // 1:1 conversion for stablecoin
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        const order = {
            orderId,
            productId,
            quantity,
            buyerAddress,
            totalAmount,
            tokenAmount,
            status: 'pending',
            createdAt: new Date(),
            expiresAt
        };

        orders.set(orderId, order);

        console.log(`[CREATE-ORDER] Created order ${orderId} for ${buyerAddress}`);

        return NextResponse.json({
            orderId,
            totalAmount,
            tokenAmount,
            expiresAt: expiresAt.toISOString()
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
