import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/shared/Header';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://freedf.in'),
  title: {
    default: 'Freedf - Free Online PDF Tools | Merge, Split, Compress & Convert PDF',
    template: '%s | Freedf',
  },
  description:
    'Freedf offers a complete suite of free online PDF tools. Merge, split, compress, convert, and edit your PDF files securely in your browser. No installation required.',
  keywords: ['PDF tools', 'merge PDF', 'compress PDF', 'split PDF', 'PDF converter', 'free PDF tools', 'online PDF'],
  authors: [{ name: 'Freedf' }],
  openGraph: {
    type: 'website',
    siteName: 'Freedf',
    title: 'Freedf - Free Online PDF Tools | Merge, Split, Compress & Convert PDF',
    description: 'Free, private, browser-based PDF tools. No uploads, no server. Your files never leave your device.',
    url: 'https://freedf.in',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Freedf PDF Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freedf - Free Online PDF Tools',
    description: 'Free, private, browser-based PDF tools.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}>
        <Navbar />
        {children}

      </body>
    </html>
  );
}
