
import { Product } from '../types';

export interface ProductData {
  name: string;
  description: string;
  price: bigint | string;
  image: string;
  stock: bigint | number;
  active: boolean;
  companyId: bigint | string;
}

export function normalizeProduct(productResult: ProductData, productId: bigint): Product {
  // Handle possible BigNumber values from ethers
  const price = typeof productResult.price === 'bigint' ? productResult.price.toString() : productResult.price;
  const companyId = typeof productResult.companyId === 'bigint' ? productResult.companyId.toString() : productResult.companyId;

  // Ensure values are strings, not arrays
  const cleanedPrice = Array.isArray(price) ? price[0].toString() : price.toString();
  const cleanedCompanyId = Array.isArray(companyId) ? companyId[0].toString() : companyId.toString();

  return {
    id: productId.toString(),
    companyId: cleanedCompanyId,
    name: productResult.name,
    description: productResult.description,
    price: (parseInt(cleanedPrice) / 1000000).toFixed(2), // Assuming 6 decimals
    imageHash: productResult.image || '',
    stock: Number(productResult.stock),
    isActive: productResult.active,
  };
}

export function normalizeArrayResponse(response: any): bigint[] {
  // Handle response that might be a BigNumber array or nested array
  if (Array.isArray(response)) {
    // If it's a nested array (sometimes comes back as [ [values] ])
    if (Array.isArray(response[0])) {
      return response[0] as bigint[];
    }
    return response as bigint[];
  }

  // If it's a single value
  if (typeof response === 'bigint') {
    return [response];
  }

  // Fallback
  return [];
}

export function normalizeCompany(companyResult: any, companyId: string): any {
  const owner = companyResult.owner?.toString() || companyResult[1]?.toString() || '';

  return {
    id: companyId,
    owner,
    name: companyResult.name,
    description: companyResult.description,
    isActive: companyResult.active,
    createdAt: companyResult.createdAt ? new Date(Number(companyResult.createdAt) * 1000).toISOString() : new Date().toISOString(),
  };
}