'use client';

import { useRole } from '../contexts/RoleContext';

export function RoleIndicator() {
  const { roleInfo, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 animate-pulse"></div>
        Cargando...
      </div>
    );
  }

  const getRoleConfig = () => {
    switch (roleInfo.role) {
      case 'admin':
        return {
          text: 'Administrador',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
        };
      case 'company_owner':
        return {
          text: `Propietario${roleInfo.companyName ? ` de ${roleInfo.companyName}` : ''}`,
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
        };
      case 'customer':
        return {
          text: 'Cliente',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
        };
      case 'unregistered':
        return {
          text: 'No registrado',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
        };
      case 'error':
        return {
          text: 'Error',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
        };
      default:
        return {
          text: 'Desconocido',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
        };
    }
  };

  const config = getRoleConfig();

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}
    >
      {config.text}
    </div>
  );
}
