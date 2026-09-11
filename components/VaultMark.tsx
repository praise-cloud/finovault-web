import React from 'react';

/**
 * Brand vault-wheel mark (docs 03-BRAND-STYLE.md). A gold circle divided into
 * a rotating dial segment with a centered keyhole dot.
 */
export function VaultMark({
  size = 48,
  className = '',
  subdued = false,
}: {
  size?: number;
  className?: string;
  subdued?: boolean;
}) {
  const tone = subdued ? 'var(--fv-text-secondary, currentColor)' : 'var(--fv-primary)';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Finovault"
      className={className}
    >
      <circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        style={{ stroke: tone }}
        strokeWidth="2.5"
      />
      <path
        d="M24 6 A18 18 0 0 1 37.97 14.52"
        fill="none"
        style={{ stroke: tone }}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="4.5" style={{ fill: tone }} />
    </svg>
  );
}