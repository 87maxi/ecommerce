import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Este endpoint será llamado por el webhook, no directamente por el frontend
// Por seguridad, no debe exponerse como GET ni permitirse CORS
import EuroTokenABI from '@/lib/EuroTokenABI';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, amount } = await request.json();

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
    });
  } catch (error) {
    console.error('Error minteando tokens:', error);
    return NextResponse.json(
      { error: 'Failed to mint tokens' }, 
      { status: 500 }
    );
  }
}