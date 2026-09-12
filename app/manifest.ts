import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FINOVAULT — Financial Intelligence',
    short_name: 'FINOVAULT',
    description: 'See your money, understand your patterns, and own your financial future. Never enter debt.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070a13',
    theme_color: '#070a13',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/finovault_logo_2d.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
