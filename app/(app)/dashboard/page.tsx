'use client';

import React from 'react';
import { RoleHome } from '@/features/dashboard/HomeDashboard';
import { useAuthStore } from '@/stores/auth-store';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return (
    <RoleHome
      name={user.fullName}
      primaryRole={user.primaryRole}
      femaleFounder={user.scheme === 'female_founder'}
    />
  );
}