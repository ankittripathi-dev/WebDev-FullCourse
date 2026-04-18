import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repair PDF - Recover Corrupted PDF',
  description:
    'Repair damaged or corrupted PDF files. Recover data from unreadable PDF documents.',
};

export default function RepairPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
