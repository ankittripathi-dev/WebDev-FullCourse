import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Extract Pages - Split PDF Pages',
  description:
    'Extract high-quality images or separating specific pages from your PDF file.',
};

export default function ExtractPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
