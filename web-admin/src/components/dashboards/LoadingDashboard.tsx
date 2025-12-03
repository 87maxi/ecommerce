'use client';

export function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Panel de Administración
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Cargando información del usuario...
          </p>
        </div>

        <div className="mt-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">
              Determinando rol de usuario...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
