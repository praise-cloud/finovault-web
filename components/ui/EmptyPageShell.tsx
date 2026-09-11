'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface EmptyPageShellProps {
  title: string;
  emptyTitle: string;
  emptyBody?: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

/**
 * Static-first page shell: h1 (24px/700) + EmptyState. No data fetch in v1
 * (see FE-009 spec §4) — API-backed states land with the API.
 */
export function EmptyPageShell({ title, emptyTitle, emptyBody, icon, children }: EmptyPageShellProps) {
  return (
    <div>
      <h1 className="mb-3 text-2xl font-bold text-[var(--fv-text)]">{title}</h1>
      <EmptyState title={emptyTitle} body={emptyBody} icon={icon} />
      {children}
    </div>
  );
}