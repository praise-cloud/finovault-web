import React from 'react';

export interface SectionHeaderProps {
  title: string;
  kicker?: string;
  actionLabel?: string;
  onAction?: () => void;
  id?: string;
  className?: string;
}

export function SectionHeader({ title, kicker, actionLabel, onAction, id, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-3 flex items-end justify-between gap-2 ${className}`}>
      <div className="flex flex-col">
        {kicker ? (
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--fv-role-accent,var(--fv-primary))]">
            {kicker}
          </span>
        ) : null}
        <h2 id={id} className="text-lg font-semibold text-[var(--fv-text)]">{title}</h2>
      </div>
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