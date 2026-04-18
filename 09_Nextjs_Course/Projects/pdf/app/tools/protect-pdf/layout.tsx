import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Protect PDF - Add Password to PDF',
  description:
    'Encrypt your PDF files with various security levels. Add passwords to your PDFs to prevent unauthorized access.',
};

export default function ProtectPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
