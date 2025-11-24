# Análisis del Proyecto stablecoin/compra-stableboin


## Intruciones para inicializar el projecto 
1. crea siempre el directorio     stablecoin/compra-stableboin, si no existe , este sera el workspace del projecto
2. inicializa el projecto con el comando npm init en el directorio stablecoin/compra-stableboin
3. usa en todo momento el directorio stablecoin/compra-stableboin como workspace para este desarrollo
4. usa siempre  las herramientas basadas en nextjs, react, ethersjs
5. usa siempre las convenciones de desarrollo de typescript
6. tienes que hacer los procesos para mantener la coherencia en el desarrollo y el codigo
7. presta especial atencion en los imports del codigo,
10. ejecuta los comandos que sean necesarios
11. crea los archivos necesarios para este projecto, siguiendo los estandares de nextjs



## Descripción General

El proyecto `stablecoin/compra-stableboin` es una aplicación web desarrollada con Next.js 15 (App Router) que permite a usuarios comprar tokens EuroToken (EURT) utilizando tarjetas de crédito a través de Stripe. Los tokens comprados son enviados directamente a la billetera MetaMask del usuario.

## Framework y Tecnologías

- **Framework:** Next.js 15 con App Router
- **Frontend:** React 19 + TypeScript
- **Estilos:** Tailwind CSS
- **Pagos:** Stripe Elements
- **Web3:** Ethers.js
- **Backend:** Next.js API Routes

La aplicación sigue una arquitectura full-stack utilizando el sistema de rutas App Router de Next.js, con componentes server y client-side rendering.

## Estructura del Proyecto

```
stablecoin/compra-stableboin/
├── public/
├── src/
│   └── app/
│       ├── api/
│       │   ├── create-payment-intent/
│       │   ├── mint-tokens/
│       │   ├── verify-payment/
│       │   └── webhook/
│       ├── components/
│       │   ├── CheckoutForm.tsx
│       │   ├── EuroTokenPurchase.tsx
│       │   └── MetaMaskConnect.tsx
│       ├── layout.tsx
│       └── page.tsx
├── .env.example
└── README.md
```

## Configuración

El proyecto requiere variables de entorno para su funcionamiento:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Clave pública de Stripe para el frontend
- `STRIPE_SECRET_KEY`: Clave secreta de Stripe para el backend
- `NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS`: Dirección del contrato EuroToken
- `OWNER_PRIVATE_KEY`: Clave privada del propietario para mintear tokens
- `NEXT_PUBLIC_NETWORK_NAME`: Red blockchain (por defecto localhost:8545)

La configuración completa está documentada en el README.

## Componentes Principales

### `page.tsx` - Página Principal

Página de entrada que muestra:
- Información sobre la compra de EURT
- Botón para probar la pasarela de pago
- Componente principal de compra `EuroTokenPurchase`

Contiene un enlace de prueba directo a la pasarela de pago con valores predefinidos.

### `components/EuroTokenPurchase.tsx`

Componente principal de la interfaz de compra que gestiona todo el flujo de compra:

- Selección de monto (€10 - €10,000)
- Conexión con MetaMask para obtener dirección de destino
- Cálculo automático de tokens a recibir (1:1 EUR:EURT)
- Interacción con Stripe para procesamiento de pagos

#### Estado del Componente

```tsx
const [amount, setAmount] = useState<number>(100);
const [walletAddress, setWalletAddress] = useState<string>('');
const [clientSecret, setClientSecret] = useState<string>('');
const [isLoading, setIsLoading] = useState<boolean>(false);
```

#### Flujo de Pago

1. **Conexión de billetera:** El usuario conecta su billetera MetaMask
2. **Creación de Payment Intent:** Se crea un intento de pago en Stripe
3. **Procesamiento de pago:** El usuario completa el pago con Stripe
4. **Mint de tokens:** Tras pago exitoso, se acuñan tokens y se envían al usuario

### `components/MetaMaskConnect.tsx`

Gestiona la conexión con la billetera MetaMask del usuario.

#### Funciones Clave

```tsx
const connectWallet = async () => {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  
  if (accounts.length > 0) {
    setWalletAddress(accounts[0]);
    setIsConnected(true);
    onWalletConnected(accounts[0]);
    await updateBalance(accounts[0]);
  }
};
```

- Conecta con MetaMask
- Detecta automáticamente cuentas ya conectadas
- Muestra balance de EURT del usuario
- Maneja errores de conexión y rechazo

### `components/CheckoutForm.tsx`

Formulario de pago que utiliza Stripe Elements para procesar el pago de forma segura.

#### Finalización de Pago

```tsx
const handleSubmit = async (event: React.FormEvent) => {
  // ...
  
  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.origin}/success`,
    },
    redirect: 'if_required',
  });

  if (!error && paymentIntent && paymentIntent.status === 'succeeded') {
    // Mint tokens after successful payment
    try {
      const mintResponse = await fetch('/api/mint-tokens', {
        method: 'POST',
        body: JSON.stringify({ walletAddress, amount }),
      });
      
      if (mintResponse.ok) {
        const mintData = await mintResponse.json();
        console.log('Tokens minted successfully:', mintData);
      }
    } catch (error) {
      console.error('Error minting tokens:', error);
    }
  }
};
```

Captura los eventos de éxito del pago y automáticamente invoca el mint de tokens.

## API Endpoints

### `api/create-payment-intent/route.ts`

Crea un nuevo intento de pago en Stripe.

```ts
export async function POST(request: NextRequest) {
  const { amount, currency = 'eur', walletAddress } = await request.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: {
      walletAddress,
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
  });
}
```

**Entrada:** `{ amount, currency, walletAddress }`
**Salida:** `{ clientSecret }`
**Uso:** Inicializa el flujo de pago con Stripe

### `api/mint-tokens/route.ts`

Acuña tokens EURT y los envía a la billetera del usuario.

```ts
export async function POST(request: NextRequest) {
  const { walletAddress, amount } = await request.json();

  // Connect to blockchain
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  const signer = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY!, provider);
  
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS!,
    EUROTOKEN_ABI,
    signer
  );
  
  // Mint tokens
  const tx = await contract.mint(walletAddress, amountToMint);
  await tx.wait();
  
  return NextResponse.json({
    success: true,
    transactionHash: tx.hash,
  });
}
```

**Entrada:** `{ walletAddress, amount }`
**Salida:** Resultado del mint con hash de transacción
**Seguridad:** Usa clave privada del propietario almacenada en variables de entorno

### `api/verify-payment/route.ts`

Verifica el estado de un pago existente.

**Uso:** Permite verificar si un pago ha sido completado o no

### `api/webhook/route.ts`

Webhook de Stripe que procesa eventos de pago automáticamente.

```ts
if (event.type === 'payment_intent.succeeded') {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
  try {
    await mintTokens(paymentIntent);
    console.log('Tokens minted successfully for payment:', paymentIntent.id);
  } catch (error) {
    console.error('Error minting tokens:', error);
    return NextResponse.json({ error: 'Failed to mint tokens' }, { status: 500 });
  }
}
```

Mantiene la consistencia automatizando el mint de tokens cuando un pago se completa sin necesidad de intervención del frontend.

## Arquitectura de Pago

1. El usuario selecciona un monto y conecta su billetera
2. El frontend crea un Payment Intent en Stripe
3. El usuario completa el pago a través del formulario