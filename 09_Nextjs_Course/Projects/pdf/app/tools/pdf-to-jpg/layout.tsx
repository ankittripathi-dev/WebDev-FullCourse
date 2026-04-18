import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to JPG - Convert PDF pages to Images',
  description:
    'Convert PDF pages into high-quality JPG images. Extract images from your PDF documents instantly.',
};

export default function PdfToJpgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
