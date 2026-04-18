import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rotate PDF - Rotate PDF Pages',
  description:
    'Rotate PDF pages permanently. Save your PDF with pages rotated 90, 180, or 270 degrees.',
};

export default function RotatePdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
