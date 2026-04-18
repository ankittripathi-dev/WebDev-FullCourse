import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OCR PDF - Recognize Text in PDF',
  description:
    'Convert scanned PDFs into searchable and selectable text documents using OCR technology.',
};

export default function OcrPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
