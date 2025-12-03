'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import EcommerceABI from '@/contracts/abis/EcommerceABI.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ECOMMERCE_CONTRACT_ADDRESS || '';

export function useSimpleContract() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const initContract = async () => {
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any);
          const web3Signer = web3Provider.getSigner();
          
          setProvider(web3Provider);
          setSigner(web3Signer);

          const ecommerceContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            EcommerceABI,
            web3Signer
          );

          setContract(ecommerceContract);
        } catch (error) {
          console.error('Error initializing contract:', error);
        }
      };

      initContract();
    }
  }, []);

  return { contract, provider, signer };
}