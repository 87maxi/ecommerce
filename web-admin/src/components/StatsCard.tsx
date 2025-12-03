'use client';

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

export function StatsCard({ title, value, icon, color, description }: StatsCardProps) {
  return (
    <div className="bg-[var(--card)] overflow-hidden shadow-xl rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <div className="p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-xl p-3 ${color} shadow-sm opacity-90 hover:opacity-100 transition-opacity`}>
            {icon}
          </div>
          <div className="ml-6 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-[var(--muted)] truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-3xl font-bold text-[var(--foreground)]">{value}</div>
              </dd>
              {description && (
                <dd className="mt-2 text-sm text-[var(--muted)]">{description}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}