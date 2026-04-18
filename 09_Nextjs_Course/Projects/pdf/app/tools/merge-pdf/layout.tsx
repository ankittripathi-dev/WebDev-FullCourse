import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merge PDF - Combine PDF Files Online',
  description:
    'Merge multiple PDF files into one document instantly. Free, secure, and private PDF merger that runs in your browser.',
};

export default function MergePdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
