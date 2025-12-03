'use client';

import { RoleBasedDashboard } from '@/components/RoleBasedDashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mt-8">
          <RoleBasedDashboard />
        </div>
      </div>
    </div>
  );
}
