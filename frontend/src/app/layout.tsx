import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { GlobalLoader } from '@/components/GlobalLoader';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Nomadic Ventures',
  description: 'Creating Meaningful Journeys',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <GlobalLoader />
        {children}
      </body>
    </html>
  );
}
