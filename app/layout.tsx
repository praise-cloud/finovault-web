import type { Metadata, Viewport } from 'next';
import { Cinzel, Montserrat } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from '@/components/Providers';

const cinzel = Cinzel({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['700'],
});

const montserrat = Montserrat({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#070a13',
};

export const metadata: Metadata = {
  title: 'FINOVAULT — See it. Understand it. Own it.',
  description:
    'FINOVAULT is a financial intelligence platform. See your money, understand your patterns, and own your financial future. Never enter debt.',
  icons: {
    icon: '/finovault_logo_2d.svg',
    shortcut: '/finovault_logo_2d.svg',
    apple: '/finovault_logo_2d.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${cinzel.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}