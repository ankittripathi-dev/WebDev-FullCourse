import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crop PDF - Crop PDF Pages',
  description:
    'Crop PDF pages to remove unwanted margins or white space. Adjust the visible area of your PDF document.',
};

export default function CropPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
