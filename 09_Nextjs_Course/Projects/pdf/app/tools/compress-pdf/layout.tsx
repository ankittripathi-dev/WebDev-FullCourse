import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress PDF - Reduce PDF File Size',
  description:
    'Compress PDF files online for free. Reduce file size while maintaining quality. 100% private, client-side processing.',
};

export default function CompressPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
