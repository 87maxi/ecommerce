import { NextRequest, NextResponse } from 'next/server';
import { orders } from '@/lib/orderStorage';

export async function GET(
    request: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        const { orderId } = params;

        const order = orders.get(orderId);

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            orderId: order.orderId,
            status: order.status,
            amount: order.totalAmount,
            tokenAmount: order.tokenAmount,
            buyerAddress: order.buyerAddress,
            createdAt: order.createdAt,
            expiresAt: order.expiresAt,
            completedAt: order.completedAt || null,
            txHash: order.txHash || null
        });
    } catch (error) {
        console.error('Error getting order:', error);
        return NextResponse.json(
            { error: 'Failed to get order' },
            { status: 500 }
        );
    }
}
