import React from 'react';

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({ title, actionLabel, onAction, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-2 flex items-center justify-between ${className}`}>
      <h2 className="text-lg font-semibold text-[var(--fv-text)]">{title}</h2>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="px-2 py-1 text-[14px] font-semibold text-[var(--fv-primary)] hover:opacity-80"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}