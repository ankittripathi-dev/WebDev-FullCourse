import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Page Numbers - Number PDF Pages',
  description:
    'Add page numbers to your PDF files. Select position, format, and typography for your page numbering.',
};

export default function AddPageNumbersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
