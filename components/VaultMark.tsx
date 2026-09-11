import React from 'react';

/**
 * Official Finovault 2D brutalist vault mark.
 * Flat geometric brutalist mark featuring the vault hinge barrel,
 * security bolts, cobalt vault coin, and centered geometric "F"
 * with crisp black outlines for clarity on any background.
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
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Finovault"
      className={`shrink-0 select-none ${className}`}
      style={subdued ? { opacity: 0.85 } : undefined}
    >
      {/* Vault hinge barrel (right side) */}
      <g stroke="#000000" strokeWidth="10" strokeLinejoin="round">
        <rect x="336" y="150" width="120" height="212" rx="16" fill="#14239E" />
        <circle cx="486" cy="256" r="26" fill="#14239E" />
        <rect x="486" y="246" width="26" height="20" fill="#14239E" />
      </g>
      <circle cx="486" cy="256" r="10" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />

      {/* Hinge bolts */}
      <circle cx="366" cy="196" r="13" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
      <circle cx="366" cy="256" r="13" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
      <circle cx="366" cy="316" r="13" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />

      {/* Main vault-door coin */}
      <circle cx="230" cy="256" r="198" fill="#1B3FE0" stroke="#000000" strokeWidth="16" />
      <circle cx="230" cy="256" r="160" fill="none" stroke="#000000" strokeWidth="7" />

      {/* Flat geometric "F" */}
      <polygon
        points="0,0 140,0 140,45 45,45 45,90 115,90 115,133 45,133 45,195 0,220"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="8"
        strokeLinejoin="round"
        transform="translate(158,138) scale(1.05)"
      />
    </svg>
  );
}