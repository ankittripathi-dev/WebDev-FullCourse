import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organize PDF - Rearrange PDF Pages',
  description:
    'Rearrange, reorder, delete, and rotate pages in your PDF files. Get your documents in the right order.',
};

export default function OrganizePdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
