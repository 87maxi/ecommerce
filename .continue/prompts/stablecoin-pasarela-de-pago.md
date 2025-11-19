# Análisis del Proyecto stablecoin/pasarela-de-pago

## Descripción General

El proyecto `stablecoin/pasarela-de-pago` es una pasarela de pago descentralizada para el token EuroToken (EURT). Permite a comerciantes recibir pagos directos de clientes utilizando billeteras Web3 como MetaMask. La pasarela procesa pagos mediante transferencias de tokens EURT desde la billetera del cliente a la del comerciante.

## Framework y Tecnologías

- **Framework:** Next.js 15.5.4 con App Router
- **Frontend:** React 19.1.0 + TypeScript
- **Estilos:** Tailwind CSS 4
- **Blockchain:** Ethers.js 6.15.0
- **Empaquetado:** Turbopack (para desarrollo)

La aplicación está optimizada para desarrollo rápido con hot-reload y es un ejemplo de dApp (aplicación descentralizada) para pagos con cripto.

## Estructura del Proyecto

```
pasarela-de-pago/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── PaymentGateway.tsx
│   │   │   └── PaymentGatewayDirect.tsx
│   │   ├── api/
│   │   │   └── process-payment/
│   │   │       └── route.ts
│   │   ├── test/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── favicon.ico
│   └── types/
│       └── ethereum.d.ts
├── public/
├── next.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

## Configuración

La pasarela se configura mediante variables de entorno y constantes en el código:
- `EUROTOKEN_CONTRACT_ADDRESS`: Dirección del contrato EuroToken
- `ECOMMERCE_CONTRACT_ADDRESS`: Dirección del contrato de comercio

Ambas direcciones deben actualizarse según la red de despliegue. La configuración utiliza la red local (anvil/hardhat) por defecto.

## Componente Principal: PaymentGateway.tsx

### Flujo de Pago

El componente gestiona todo el flujo de pago con 6 pasos principales:

1. **Validación de parámetros URL**
2. **Conexión con MetaMask**
3. **Validación de dirección de cliente**
4. **Verificación de saldo**
5. **Firma de transacción**
6. **Resultado y redirección**

### Parámetros URL Requeridos

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `merchant_address` | string | Dirección Ethereum del comerciante |
| `address_customer` | string | Dirección Ethereum del cliente |
| `amount` | string | Cantidad a pagar en EURT |
| `invoice` | string | Número de factura o identificador |
| `date` | string | Fecha de la transacción |
| `redirect` | string | URL de retorno (opcional) |

Ejemplo de URL:
```
http://localhost:3002/?merchant_address=0x1234...&address_customer=0x5678...&amount=100.50&invoice=INV-001&date=2025-10-14&redirect=https://miapp.com/success
```

### Estado del Componente

```tsx
const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
const [isConnected, setIsConnected] = useState(false);
const [currentAddress, setCurrentAddress] = useState<string>('');
const [balance, setBalance] = useState<string>('0');
const [isProcessing, setIsProcessing] = useState(false);
const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
```

### Conexión con Red Local

```tsx
const connectToLocalNetwork = async () => {
  try {
    // Intentar cambiar a red local
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x7a69' }], // 31337 en hex
    });
  } catch (switchError: any) {
    // Si la red no existe, añadirla
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x7a69',
            chainName: 'Localhost 8545',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['http://127.0.0.1:8545'],
          }],
        });
      } catch (addError) {
        console.error('Error adding network:', addError);
        alert('Error al agregar la red local');
      }
    }
  }
};
```

Permite al usuario conectarse fácilmente a una red blockchain local (anvil/hardhat).

### Conexión con Wallet

```tsx
const connectWallet = async () => {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  }) as string[];

  if (accounts.length > 0) {
    setCurrentAddress(accounts[0]);
    setIsConnected(true);
    await updateBalance(accounts[0]);
  }
};
```

### Procesamiento de Pago

```tsx
const processPayment = async () => {
  // ...
  
  // Verificar saldo
  const currentBalance = await euroTokenContract.balanceOf(currentAddress);
  if (currentBalance < amountWei) {
    // Manejar caso de saldo insuficiente
    return;
  }

  // Aprovar Ecommerce contract para gastar tokens
  const approveTx = await euroTokenContract.approve(ECOMMERCE_CONTRACT_ADDRESS, amountWei);
  await approveTx.wait();

  // Llamar a processPayment en contrato de comercio
  const ecommerceContract = new ethers.Contract(ECOMMERCE_CONTRACT_ADDRESS, ECOMMERCE_ABI, signer);
  const tx = await ecommerceContract.processPayment(currentAddress, amountWei, invoiceId);
  
  const receipt = await tx.wait();
  
  // Enviar resultado a ventana padre
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'PAYMENT_COMPLETED',
      result: result
    }, '*');
  }
};
```

El flujo incluye:
- Llamada al `approve` del contrato ERC-20
- Llamada al `processPayment` del contrato de comercio
- Redirección o envío de mensaje con resultado

## Componente Alternativo: PaymentGatewayDirect.tsx

Versión simplificada que solo muestra los parámetros recibidos, útil para pruebas y desarrollo.

## API Endpoint

### `api/process-payment/route.ts`

**POST /api/process-payment** - Procesa la confirmación de un pago

**Solicitud:**
```json
{
  "transactionHash": "0x...",
  "merchantAddress": "0x...",
  "customerAddress": "0x...",
  "amount": "100.50",
  "invoice": "INV-001",
  "date": "2025-10-14T12:00:00Z"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "transactionHash": "0x...",
  "paymentData": {
    "merchant_address": "0x...",
    "address_customer": "0x...",
    "amount": "100.50",
    "invoice": "INV-001",
    "date": "2025-10-14T12:00:00Z"
  },
  "processedAt": "2025-10-14T12:00:05Z",
  "status": "completed"
}
``