import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from '@/components/Providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#F3F1EA',
};

export const metadata: Metadata = {
  title: 'FINOVAULT — Neo-Brutalist Student Vault & Fuel Gauge App',
  description:
    'The offline-first student vault and daily allowance fuel gauge designed for campus life. 20 global currencies, campus spots tracking, and direct APK download.',
  icons: {
    icon: '/finovault_logo_2d.svg',
    shortcut: '/finovault_logo_2d.svg',
    apple: '/finovault_logo_2d.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Montserrat:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F3F1EA] text-[#0A0A0A] font-sans">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
