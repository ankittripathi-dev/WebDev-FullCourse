import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JPG to PDF - Convert Images to PDF',
  description:
    'Convert JPG, PNG, and other image formats to PDF. Combine multiple images into a single PDF document.',
};

export default function JpgToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
