import { NextRequest, NextResponse } from 'next/server';

// Tipos para validación de entrada
interface ProcessPaymentRequestBody {
  transactionHash: string;
  merchantAddress: string;
  customerAddress: string;
  amount: string;
  invoice: string;
  date: string;
}

// Tipos para respuesta
interface ProcessPaymentResponse {
  success: boolean;
  transactionHash: string;
  paymentData: {
    merchant_address: string;
    address_customer: string;
    amount: string;
    invoice: string;
    date: string;
  };
  processedAt: string;
  status: 'completed' | 'failed';
}

export async function POST(req: NextRequest) {
  try {
    const body: ProcessPaymentRequestBody = await req.json();

    // Validar campos requeridos
    const requiredFields = ['transactionHash', 'merchantAddress', 'customerAddress', 'amount', 'invoice', 'date'];
    const missingFields = requiredFields.filter(field => !body[field as keyof ProcessPaymentRequestBody]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Campos requeridos faltantes: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Aquí iría la lógica para verificar la transacción en blockchain
    // Por ahora, simular éxito

    const response: ProcessPaymentResponse = {
      success: true,
      transactionHash: body.transactionHash,
      paymentData: {
        merchant_address: body.merchantAddress,
        address_customer: body.customerAddress,
        amount: body.amount,
        invoice: body.invoice,
        date: body.date,
      },
      processedAt: new Date().toISOString(),
      status: 'completed'
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error('Error processing payment:', err);
    return NextResponse.json(
      { success: false, error: err.message, status: 'failed' },
      { status: 500 }
    );
  }
}

// GET /api/process-payment?transactionHash=0x...
// Obtiene el estado de un pago por hash de transacción
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const transactionHash = searchParams.get('transactionHash');
  
  if (!transactionHash) {
    return NextResponse.json(
      { error: 'transactionHash es requerido' },
      { status: 400 }
    );
  }

  // Aquí iría la lógica para consultar estado en base de datos o blockchain
  // Por ahora, simular respuesta

  return NextResponse.json({
    transactionHash,
    status: 'completed',
    verifiedAt: new Date().toISOString()
  });
}