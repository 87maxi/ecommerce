export const CONTRACT_ADDRESSES = {
  31337: {
    ecommerce: process.env.NEXT_PUBLIC_ECOMMERCE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    euroToken: process.env.NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
  // Puedes agregar más redes aquí
  // 1: { // Mainnet
  //   ecommerce: '0x...',
  //   euroToken: '0x...',
  // },
  // 5: { // Goerli
  //   ecommerce: '0x...',
  //   euroToken: '0x...',
  // },
};

export function getContractAddress(chainId: number, contract: 'ecommerce' | 'euroToken'): string {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!addresses) {
    throw new Error(`Network ${chainId} not supported`);
  }
  const address = addresses[contract];
  if (!address) {
    throw new Error(`Contract ${contract} not deployed on network ${chainId}`);
  }
  return address;
}

export const SUPPORTED_CHAINS = [
  {
    id: 31337,
    name: 'Ethereum Local',
    currency: 'ETH',
  },
  // {
  //   id: 1,
  //   name: 'Ethereum Mainnet',
  //   currency: 'ETH',
  // },
  // {
  //   id: 5,
  //   name: 'Goerli Testnet',
  //   currency: 'ETH',
  // },
];
