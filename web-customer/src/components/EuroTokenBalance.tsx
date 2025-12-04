'use client';

import { useEuroTokenBalance } from '@/hooks/useEuroTokenBalance';
import { Loader2 } from 'lucide-react';

export function EuroTokenBalance() {
  const { balance, loading, error } = useEuroTokenBalance();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Cargando saldo...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-900/20 rounded-full border border-blue-500/30">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <span className="text-xs font-medium text-blue-300">EURT</span>
      </div>
      <span className="font-mono text-sm font-medium text-foreground">
        {parseFloat(balance).toFixed(2)}
      </span>
    </div>
  );
}