import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FINOVAULT — Student Vault & Allowance App',
    short_name: 'FINOVAULT',
    description: 'The offline-first student vault and daily allowance fuel gauge designed for campus life.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F3F1EA',
    theme_color: '#F3F1EA',
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
