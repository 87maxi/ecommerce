import { NextRequest, NextResponse } from 'next/server';
import { verifyTransfer } from '@/lib/eurt';
import { orders } from '@/lib/orderStorage';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, txHash } = body;

        if (!orderId || !txHash) {
            return NextResponse.json(
                { error: 'Missing required fields: orderId, txHash' },
                { status: 400 }
            );
        }

        // Get order from storage
        const order = orders.get(orderId);

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        if (order.status !== 'pending') {
            return NextResponse.json(
                { error: `Order already ${order.status}` },
                { status: 400 }
            );
        }

        // Check if order has expired
        if (new Date() > new Date(order.expiresAt)) {
            order.status = 'expired';
            orders.set(orderId, order);
            return NextResponse.json(
                { error: 'Order has expired' },
                { status: 400 }
            );
        }

        // Get merchant address from environment
        const merchantAddress = process.env.MERCHANT_WALLET_ADDRESS || process.env.OWNER_PRIVATE_KEY;

        if (!merchantAddress) {
            return NextResponse.json(
                { error: 'Merchant address not configured' },
                { status: 500 }
            );
        }

        // Verify the transaction
        const verification = await verifyTransfer(
            txHash,
            order.tokenAmount.toString(),
            merchantAddress
        );

        if (!verification.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Transaction verification failed',
                    details: verification
                },
                { status: 400 }
            );
        }

        // Update order status
        order.status = 'completed';
        order.txHash = txHash;
        order.completedAt = new Date();
        orders.set(orderId, order);

        console.log(`[EXECUTE-PURCHASE] Order ${orderId} completed with tx ${txHash}`);

        return NextResponse.json({
            success: true,
            order: {
                orderId: order.orderId,
                status: order.status,
                txHash: order.txHash,
                completedAt: order.completedAt
            }
        });
    } catch (error) {
        console.error('Error executing purchase:', error);
        return NextResponse.json(
            { error: 'Failed to execute purchase' },
            { status: 500 }
        );
    }
}
