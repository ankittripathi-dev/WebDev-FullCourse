import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Remove Pages - Delete PDF Pages',
  description:
    'Delete unwanted pages from your PDF documents. Select and remove pages easily.',
};

export default function RemovePagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
