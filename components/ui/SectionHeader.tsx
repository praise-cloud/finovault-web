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
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--fv-role-strong,var(--fv-primary))]">
            {kicker}
          </span>
        ) : null}
        <h2 id={id} className="text-base sm:text-lg font-black uppercase tracking-tight text-[var(--fv-text)]">{title}</h2>
      </div>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="px-2 py-1 text-xs font-black uppercase tracking-wider text-[var(--fv-role-strong,var(--fv-primary))] hover:underline"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}