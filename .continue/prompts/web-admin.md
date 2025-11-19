# Análisis del Proyecto web-admin

## Descripción General

El proyecto `web-admin` es una aplicación de panel de administración para el sistema de comercio electrónico descentralizado. Permite a administradores gestionar empresas, productos, clientes e invoices dentro del ecosistema blockchain. La aplicación está construida con Next.js 15 utilizando App Router y sigue un enfoque de arquitectura monolítica server-side con componentes client-side.

## Framework y Tecnologías

- **Framework:** Next.js 15 con App Router
- **Frontend:** React 19 + TypeScript
- **Estilos:** Tailwind CSS
- **Web3:** Ethers.js v6
- **Gestión de Estado:** Context API + hooks personalizados
- **Ecosistema Web3:** MetaMask como billetera principal

La aplicación combina server components para renderizado inicial y client components para interactividad, aprovechando las ventajas de ambos enfoques.

## Estructura del Proyecto

```
web-admin/
├── src/
│   ├── app/
│   │   ├── companies/
│   │   │   └── page.tsx
│   │   ├── company/
│   │   │   ├── [id]/
│   │   │   │   ├── customers/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── invoices/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── wallet-connect.tsx
│   ├── contracts/
│   │   └── Ecommerce.json
│   ├── hooks/
│   │   ├── useContract.ts
│   │   └── useWallet.ts
│   ├── lib/
│   │   ├── contracts/
│   │   │   ├── abis/
│   │   │   │   ├── CompanyRegistry.json
│   │   │   │   ├── CustomerRegistry.json
│   │   │   │   ├── InvoiceSystem.json
│   │   │   │   ├── PaymentGateway.json
│   │   │   │   ├── ProductCatalog.json
│   │   │   │   └── ShoppingCart.json
│   │   │   ├── abis.ts
│   │   │   └── addresses.ts
│   │   └── wallet/
│   │       └── provider.ts
│   └── types/
├── next.config.ts
└── tsconfig.json
```

## Configuración

La aplicación utiliza variables de entorno para configurar direcciones de contratos:

- `NEXT_PUBLIC_ECOMMERCE_CONTRACT_ADDRESS`: Dirección del contrato Ecommerce
- `NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS`: Dirección del contrato EuroToken

Estas variables se utilizan en `lib/contracts/addresses.ts` para obtener las direcciones según el `chainId`.

## Arquitectura y Componentes Clave

### Hook: `useWallet`

Gestiona la conexión con billeteras Web3, principalmente MetaMask.

#### Funciones Principales

```tsx
export function useWallet() {
  const [state, setState] = useState<WalletState>({ /* ... */ });

  // Conecta con una billetera
  const connect = useCallback(async (walletInfo: WalletInfo) => {
    const { provider, signer, address, chainId } = await connectWalletProvider(walletInfo);
    
    setState((prev) => ({ ...prev, provider, signer, address, chainId }));
    
    // Persiste en localStorage
    localStorage.setItem('selectedWallet', JSON.stringify(walletInfo));
    localStorage.setItem('connectedAddress', address);
    localStorage.setItem('connectedChainId', chainId.toString());
  }, []);

  // Se desconecta
  const disconnect = useCallback(() => {
    setState({ /* reinicia estado */ });
    // Limpia localStorage
    localStorage.removeItem('selectedWallet');
    localStorage.removeItem('connectedAddress');
    localStorage.removeItem('connectedChainId');
  }, []);

  // Cambia de red
  const switchNetwork = useCallback(async (chainId: number) => {
    await switchNetworkProvider(chainId);
    const network = await state.provider!.getNetwork();
    setState((prev) => ({ ...prev, chainId: Number(network.chainId) }));
  }, [state.provider]);

  // Auto-conexión
  useEffect(() => {
    async function autoConnect() {
      const savedWallet = localStorage.getItem('selectedWallet');
      if (savedWallet) {
        const walletInfo = JSON.parse(savedWallet);
        await connect(walletInfo, true); // modo silencioso
      }
    }
    autoConnect();
  }, []);

  // Escucha cambios
  useEffect(() => {
    // handlers para accountsChanged y chainChanged
    // ...
  }, [state.provider, disconnect]);

  return { ...state, connect, disconnect, switchNetwork, isConnected: !!state.address };
}
```

La implementación incluye:
- Auto-conexión al refrescar la página
- Persistencia en localStorage
- Manejo de cambios de cuenta/red
- Soporte para múltiples billeteras (extensible)

### Hook: `useContract`

Gestiona la creación de instancias de contratos inteligentes.

```tsx
export function useContract(
  contractName: ContractName,
  provider: BrowserProvider | null,
  signer: JsonRpcSigner | null,
  chainId: number | null
) {
  return useMemo(() => {
    if (!provider || !signer || !chainId) return null;

    try {
      const address = getContractAddress(chainId, contractName);
      const abi = ABIS[contractName];
      return new Contract(address, abi, signer);
    } catch (error) {
      console.error(`Failed to load contract ${contractName}:`, error);
      return null;
    }
  }, [contractName, provider, signer, chainId]);
}
```

- Crea instancias de contratos cuando hay proveedor, firmante y chainId
- Utiliza `useMemo` para evitar recrear instancias innecesarias
- Maneja errores de carga

### Archivo: `lib/contracts/addresses.ts`

```tsx
export const CONTRACT_ADDRESSES = {
  31337: {
    ecommerce: process.env.NEXT_PUBLIC_ECOMMERCE_CONTRACT_ADDRESS || '',
    euroToken: process.env.NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS || '',
  },
};

export function getContractAddress(chainId: number, contract: keyof typeof CONTRACT_ADDRESSES[31337]): string {
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
```

Mapea direcciones de contratos por chainId, soportando actualmente solo la red local (31337).

## Rutas y Páginas

### Página Principal: `page.tsx`

Página de entrada que muestra un mensaje diferente según el estado de la billetera:
- Si se está conectando: muestra "Cargando..."
- Si no está conectada: pide conectar MetaMask
- Si está conectada: muestra enlace al panel de empresas

### Panel de Empresas: `companies/page.tsx`

Permite registrar y gestionar empresas.

#### Registro de Empresa

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const tx = await ecommerce.registerCompany(
      formData.address,
      formData.name,
      formData.description
    );
    await tx.wait();

    // Recargar empresas
    const result = await ecommerce.getAllCompanies();
    setCompanies(result);
  } catch (error) {
    console.error('Failed to register company:', error);
  }
};
```

Incluye un formulario para registrar nuevas empresas (requiere permisos de owner)

### Gestión de Empresa: `company/[id]/page.tsx`

Permite gestionar productos de una empresa específica.

#### Verificación de Prop