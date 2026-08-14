import type { Metadata } from 'next';
import { Cinzel, Montserrat } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const cinzel = Cinzel({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['700'],
});

const montserrat = Montserrat({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Finovault — Vault Your Future. Grow Your Wealth.',
  description:
    'Finovault is a wealth platform for African income realities: protect what you have, grow your wealth, pay for life without friction.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}