import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Watermark - Watermark PDF Files',
  description:
    'Add text or image watermarks to your PDF documents. Custom timestamp, text styling, and transparency.',
};

export default function AddWatermarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
