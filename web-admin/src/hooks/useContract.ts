import { useMemo } from 'react';
import { Contract } from 'ethers';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { getContractAddress } from '../lib/contracts/addresses';
import { ABIS, ContractName } from '../lib/contracts/abis';

export function useContract(
  contractName: ContractName,
  provider: BrowserProvider | null,
  signer: JsonRpcSigner | null,
  chainId: number | null
): Contract | null {
  return useMemo(() => {
    if (!provider || !signer || !chainId) return null;

    try {
      const address = getContractAddress(chainId, contractName);
      const abi = ABIS[contractName];
      return new Contract(address, abi, signer);
    } catch (error) {
      console.error(`Error al cargar el contrato ${contractName}:`, error);
      return null;
    }
  }, [contractName, provider, signer, chainId]);
}