import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        // For a stablecoin, the rate is 1:1 with EUR
        return NextResponse.json({
            rate: 1,
            decimals: 6, // 6 decimales como el contrato EuroToken
            symbol: 'EURT'
        });
    } catch (error) {
        console.error('Error getting price:', error);
        return NextResponse.json(
            { error: 'Failed to get price' },
            { status: 500 }
        );
    }
}
