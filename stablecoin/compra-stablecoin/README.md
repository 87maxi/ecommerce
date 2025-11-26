# Compra de EuroToken (EURT) con Stripe

Aplicación web que permite a los usuarios comprar tokens **EuroToken (EURT)** con tarjeta de crédito a través de **Stripe**, y recibirlos directamente en su billetera **MetaMask**.

## Características

- ✅ Compra de EURT con tarjeta de crédito (Stripe)
- ✅ Conexión segura con MetaMask
- ✅ 1 EUR = 1 EURT (canje directo)
- ✅ Minteo automático de tokens tras pago exitoso
- ✅ Webhook de Stripe para procesar pagos
- ✅ Full-stack con Next.js App Router

## Tecnologías

- **Framework**: Next.js 15 + App Router
- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Pagos**: Stripe Elements + Webhooks
- **Blockchain**: Ethers.js + MetaMask + Anvil

## Configuración

1. Clona el repositorio
2. Crea un archivo `.env` basado en `.env.example`
3. Instala dependencias:

```bash
npm install
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## Variables de Entorno

| Variable | Descripción |
|--------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Clave secreta del webhook |
| `NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS` | Dirección del contrato EURT |
| `OWNER_PRIVATE_KEY` | Clave privada del minter (⚠️ cuidado) |
| `NEXT_PUBLIC_SITE_URL` | URL del sitio (para webhooks) |

## Flujo de Pago

1. Usuario selecciona monto y conecta MetaMask
2. Frontend crea `PaymentIntent` en Stripe
3. Usuario completa pago en formulario seguro
4. Webhook recibe `payment_intent.succeeded`
5. Servidor llama a `mint-tokens` para enviar EURT al usuario

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── create-payment-intent/
│   │   ├── mint-tokens/
│   │   ├── verify-payment/
│   │   └── webhook/
│   ├── components/
│   │   ├── EuroTokenPurchase.tsx
│   │   ├── MetaMaskConnect.tsx
│   │   └── CheckoutForm.tsx
│   ├── layout.tsx
│   └── page.tsx
```

## Integración con Pasarela de Pago

Esta aplicación está diseñada para interoperar con `stablecoin/pasarela-de-pago`, permitiendo:

- **Parámetros compatibles**: Soporte para `invoice` y `redirectUrl`
- **Flujo unificado**: Redirección tras pago exitoso a URLs personalizadas
- **Metadata compartida**: El campo `invoice` se propaga a través del sistema
- **Seguimiento**: El mismo `clientSecret` y parámetros se mantienen coherentes entre servicios

### Uso Combinado

1. `pasarela-de-pago` inicia el proceso con parámetros estructurados
2. `compra-stableboin` procesa el pago y mantiene la trazabilidad
3. Redirección automática al sitio original con resultados

Este enfoque permite una experiencia de pago seamless entre aplicaciones mientras se mantiene la seguridad y trazabilidad.