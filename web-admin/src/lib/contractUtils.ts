import { Company, Product } from './types';

// Normalize company data from contract response based on ABI structure
export function normalizeCompany(companyResult: any, id: any): Company {
  if (!companyResult) {
    return {
      id: id?.toString() || '',
      owner: '',
      name: '',
      description: '',
      isActive: false,
      createdAt: new Date().toISOString(),
    };
  }

  // Try to get values from properties (named) or indices (array/tuple)
  // Ethers Result objects support both, but standard arrays only support indices
  const idValue = companyResult.id?.toString() || companyResult[0]?.toString() || id?.toString() || '';
  const ownerValue = companyResult.owner?.toString() || companyResult[1]?.toString() || '';
  const nameValue = companyResult.name || companyResult[2] || '';
  const descriptionValue = companyResult.description || companyResult[3] || '';
  const isActiveValue = companyResult.isActive !== undefined ? Boolean(companyResult.isActive) : Boolean(companyResult[4]);
  const createdAtValue = companyResult.createdAt?.toString() || companyResult[5]?.toString() || '0';

  return {
    id: idValue,
    owner: ownerValue,
    name: nameValue,
    description: descriptionValue,
    isActive: isActiveValue,
    createdAt: new Date(Number(createdAtValue) * 1000).toISOString(),
  };
}

// Normalize product data from contract response based on ABI structure
export function normalizeProduct(productResult: any, id: any): Product {
  if (!productResult) {
    return {
      id: id?.toString() || '',
      companyId: '',
      name: '',
      description: '',
      price: '0',
      imageHash: '',
      stock: 0,
      isActive: false,
    };
  }

  // Try to get values from properties (named) or indices (array/tuple)
  const idValue = productResult.id?.toString() || productResult[0]?.toString() || id?.toString() || '';
  const companyIdValue = productResult.companyId?.toString() || productResult[1]?.toString() || '';
  const nameValue = productResult.name || productResult[2] || '';
  const descriptionValue = productResult.description || productResult[3] || '';
  const priceValue = productResult.price?.toString() || productResult[4]?.toString() || '0';
  const stockValue = Number(productResult.stock) || Number(productResult[5]) || 0;
  // Map 'image' field from ABI to 'imageHash' in type
  const imageValue = productResult.image || productResult[6] || '';
  const activeValue = productResult.active !== undefined ? Boolean(productResult.active) : Boolean(productResult[7]);

  return {
    id: idValue,
    companyId: companyIdValue,
    name: nameValue,
    description: descriptionValue,
    price: priceValue,
    imageHash: imageValue,
    stock: stockValue,
    isActive: activeValue,
  };
}

// Handle different return types for array responses
export function normalizeArrayResponse(response: any): any[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (typeof response === 'object' && response !== null) {
    // Check if it's a BigNumberish array-like object
    if ('toArray' in response && typeof response.toArray === 'function') {
      return response.toArray();
    }

    // Check if it has numeric indices
    const result = [];
    let i = 0;
    while (i in response) {
      result.push(response[i]);
      i++;
    }

    if (result.length > 0) {
      return result;
    }
  }

  return [];
}