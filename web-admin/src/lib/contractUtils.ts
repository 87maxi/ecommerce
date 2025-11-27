import { Company, Product } from './types';

// Normalize company data from contract response based on ABI structure
export function normalizeCompany(companyResult: any, id: any): Company {
  // Handle different response formats (object vs array)
  let idValue = '';
  let ownerValue = '';
  let nameValue = '';
  let descriptionValue = '';
  let isActiveValue = false;
  let createdAtValue = '0';

  if (typeof companyResult === 'object' && companyResult !== null) {
    // Handle object format (newer ethers.js versions)
    if ('id' in companyResult) idValue = companyResult.id?.toString() || '';
    if ('owner' in companyResult) ownerValue = companyResult.owner?.toString() || '';
    if ('name' in companyResult) nameValue = companyResult.name || '';
    if ('description' in companyResult) descriptionValue = companyResult.description || '';
    if ('isActive' in companyResult) isActiveValue = Boolean(companyResult.isActive);
    if ('createdAt' in companyResult) createdAtValue = companyResult.createdAt?.toString() || '0';
  } else if (Array.isArray(companyResult)) {
    // Handle array format (older ethers.js versions)
    idValue = companyResult[0]?.toString() || '';
    ownerValue = companyResult[1]?.toString() || '';
    nameValue = companyResult[2] || '';
    descriptionValue = companyResult[3] || '';
    isActiveValue = Boolean(companyResult[4]);
    createdAtValue = companyResult[5]?.toString() || '0';
  }

  // Fallback to id parameter if idValue is empty
  if (!idValue && id) {
    idValue = id.toString();
  }

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
  // Handle different response formats (object vs array)
  let idValue = '';
  let companyIdValue = '';
  let nameValue = '';
  let descriptionValue = '';
  let priceValue = '';
  let stockValue = 0;
  let imageValue = '';
  let activeValue = false;

  if (typeof productResult === 'object' && productResult !== null) {
    // Handle object format (newer ethers.js versions)
    if ('id' in productResult) idValue = productResult.id?.toString() || '';
    if ('companyId' in productResult) companyIdValue = productResult.companyId?.toString() || '';
    if ('name' in productResult) nameValue = productResult.name || '';
    if ('description' in productResult) descriptionValue = productResult.description || '';
    if ('price' in productResult) priceValue = productResult.price?.toString() || '';
    if ('stock' in productResult) stockValue = Number(productResult.stock) || 0;
    if ('image' in productResult) imageValue = productResult.image || '';
    if ('active' in productResult) activeValue = Boolean(productResult.active);
  } else if (Array.isArray(productResult)) {
    // Handle array format (older ethers.js versions)
    idValue = productResult[0]?.toString() || '';
    companyIdValue = productResult[1]?.toString() || '';
    nameValue = productResult[2] || '';
    descriptionValue = productResult[3] || '';
    priceValue = productResult[4]?.toString() || '';
    stockValue = Number(productResult[5]) || 0;
    imageValue = productResult[6] || '';
    activeValue = Boolean(productResult[7]);
  }

  // Fallback to id parameter if idValue is empty
  if (!idValue && id) {
    idValue = id.toString();
  }

  return {
    id: idValue,
    companyId: companyIdValue,
    name: nameValue,
    description: descriptionValue,
    price: priceValue,
    imageHash: imageValue, // Map 'image' field from ABI to 'imageHash' in type
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