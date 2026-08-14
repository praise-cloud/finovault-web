/**
 * Design tokens — single source of truth for visual values.
 * Mirrors finovault-mobile/lib/theme/tokens.ts. Source: docs/07-DESIGN-TOKENS.md
 */

export const colors = {
  primary: '#0A1F5C',
  secondary: '#08142E',
  accent: '#D4AF37',
  accentLight: '#F4D35E',
  charcoal: '#1A1A1A',

  light: {
    bg: '#F7F9FC',
    surface: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.85)',
    text: '#1A1A1A',
    textSecondary: '#43474D',
    border: '#C4C6CE',
    borderSubtle: 'rgba(196, 198, 206, 0.6)',
  },

  dark: {
    bg: '#08142E',
    surface: 'rgba(255, 255, 255, 0.08)',
    surfaceGlass: 'rgba(255, 255, 255, 0.10)',
    text: '#FFFFFF',
    textSecondary: '#B0B4BA',
    border: 'rgba(255, 255, 255, 0.15)',
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
  },

  success: '#2E7D5B',
  successBg: 'rgba(46, 125, 91, 0.12)',
  warning: '#C99A2E',
  warningBg: 'rgba(201, 154, 46, 0.12)',
  error: '#8C3A3A',
  errorBg: 'rgba(140, 58, 58, 0.12)',
  info: '#0A1F5C',
} as const;

export const typography = {
  families: {
    display: 'Cinzel',
    body: 'Montserrat',
    bodyMedium: 'Montserrat',
    bodySemiBold: 'Montserrat',
    bodyBold: 'Montserrat',
  },
  sizes: {
    h1: 34,
    h2: 26,
    h3: 21,
    body: 16,
    caption: 14,
    button: 16,
    numeral: 40,
    numeralSm: 20,
  },
  lineHeight: {
    default: 1.5,
    tight: 1.25,
  },
  letterSpacing: {
    heading: -0.02,
    wide: 0.04,
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  card: 14,
  button: 12,
  input: 10,
  badge: 8,
  pill: 999,
  iconContainer: 12,
} as const;

export const shadows = {
  card: '0 4px 24px rgba(0, 0, 0, 0.08)',
  cardDark: '0 4px 24px rgba(0, 0, 0, 0.35)',
  elevated: '0 8px 32px rgba(0, 0, 0, 0.12)',
  buttonPressed: '0 2px 8px rgba(0, 0, 0, 0.12)',
} as const;

export const motion = {
  duration: {
    instant: 100,
    fast: 150,
    normal: 250,
    slow: 400,
    vault: 800,
  },
  easing: {
    standard: [0.4, 0.0, 0.2, 1] as const,
    mechanical: [0.25, 0.1, 0.25, 1] as const,
    emphasized: [0.2, 0.0, 0, 1] as const,
  },
} as const;