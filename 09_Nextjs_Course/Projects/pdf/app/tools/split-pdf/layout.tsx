import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Split PDF - Separate PDF Pages Online',
  description:
    'Split PDF files into individual pages or extract specific pages. Free, secure, and instant PDF splitter.',
};

export default function SplitPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
