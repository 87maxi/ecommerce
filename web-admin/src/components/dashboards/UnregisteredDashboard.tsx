'use client';

import Link from 'next/link';

export function UnregisteredDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Panel de Administración
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Gestiona empresas, productos y clientes en el e-commerce
            descentralizado
          </p>
        </div>

        <div className="mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.668l.794-1.687a.5.5 0 01.927.05l.5.95A.5.5 0 0110.5 3.5h-.5a.5.5 0 01-.5-.415l-.043-.824zm2.02 2.226a1 1 0 011.568 0l1.3 1a1 1 0 01.309.805v5.814a1 1 0 01-.878.995l-.115.005H6.5a1 1 0 01-.995-.878l-.005-.115v-5.814a1 1 0 01.88-.995l1.3-.999zM5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Registro necesario
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Para acceder a todas las funciones del panel, primero debes
                    registrarte como empresa o cliente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/companies"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            >
              Registrar Empresa
            </Link>
            <span className="mx-2">o</span>
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled
            >
              Registro de Cliente (próximamente)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
