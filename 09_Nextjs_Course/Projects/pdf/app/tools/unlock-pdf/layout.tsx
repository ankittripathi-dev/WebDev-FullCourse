import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unlock PDF - Remove PDF Password',
  description:
    'Remove passwords and security restrictions from PDF files. Unlock your PDFs instantly in your browser.',
};

export default function UnlockPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
