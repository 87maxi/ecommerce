import { ethers } from 'ethers';
import EuroTokenABI from '@/lib/EuroTokenABI';

export async function mintTokens(walletAddress: string, amount: number, invoice: string) {
    console.log(`[MINT-TOKENS] Starting mint process:`, {
        walletAddress,
        amount,
        invoice
    });

    // Conexión a la red blockchain (anvil local)
    const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Wallet del owner que tiene permisos para mintear
    const privateKey = process.env.OWNER_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error('Missing OWNER_PRIVATE_KEY or PRIVATE_KEY in environment');
    }

    const wallet = new ethers.Wallet(privateKey, provider);

    // Obtener dirección del contrato
    const contractAddress = process.env.NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error('Missing NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS in environment');
    }

    // Crear instancia del contrato
    const contract = new ethers.Contract(contractAddress, EuroTokenABI, wallet);

    // Mintear tokens (convertir a wei - 18 decimales)
    const amountInWei = ethers.parseUnits(amount.toString(), 18);

    console.log(`[MINT-TOKENS] Sending transaction to blockchain...`);
    const tx = await (contract.mint as any)(walletAddress, amountInWei);

    console.log(`[MINT-TOKENS] Transaction sent, waiting for confirmation...`, {
        txHash: tx.hash
    });

    const receipt = await tx.wait();

    console.log(`[MINT-TOKENS] Tokens minted successfully!`, {
        transactionHash: receipt?.hash,
        blockNumber: receipt?.blockNumber,
        walletAddress,
        amount
    });

    return {
        transactionHash: receipt?.hash,
        blockNumber: receipt?.blockNumber,
        walletAddress,
        amount,
        invoice,
        timestamp: new Date().toISOString()
    };
}
