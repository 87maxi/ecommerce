"use client";

import { useEffect, useState } from 'react';

export default function Confirmation() {
  const [status, setStatus] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Permitir distintos indicadores de estado de pago
    const payment_status = params.get('payment_status');
    const status = params.get('status');
    const success = params.get('success');
    const redirectStatus = params.get('redirect_status');
    const redir = new URLSearchParams(window.location.hash.substring(1)).get('redirect_url');

    // Lógica de prioridad para determinar el estado del pago
    // Orden de prioridad: payment_status > redirect_status > status > success
    if (payment_status === 'succeeded') {
      setStatus('succeeded');
    } else if (redirectStatus === 'succeeded') {
      setStatus('succeeded');
    } else if (status === 'confirmed') {
      setStatus('succeeded');
    } else if (success === 'true') {
      setStatus('succeeded');
    } else if (params.get('redirect_status') === 'succeeded') {
      setStatus('succeeded');
    } else {
      setStatus('unknown');
    }
    setRedirectUrl(redir || null);

    if (redir) {
      setTimeout(() => {
        window.location.href = redir;
      }, 3000);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-700">Pago {status === 'succeeded' ? 'Éxitoso' : 'Fallido'}</h1>
        {status === 'succeeded' ? (
          <p className="text-green-600 mt-4">Tu pago ha sido procesado correctamente.</p>
        ) : (
          <p className="text-red-600 mt-4">Hubo un error al procesar tu pago.</p>
        )}
        {redirectUrl && (
          <p className="text-sm text-gray-500 mt-4">
            Redirigiendo en 3 segundos a tu tienda...
          </p>
        )}
      </div>
    </div>
  );
}