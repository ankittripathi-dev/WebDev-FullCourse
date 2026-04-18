import { Metadata } from 'next';
import Footer from '@/components/shared/Footer';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Tips, tutorials, and insights about PDF management, document security, privacy, and productivity.',
    alternates: {
        canonical: 'https://freedf.in/blog',
    },
    openGraph: {
        title: 'Freedf Blog - PDF Tips, Tutorials & Privacy Guides',
        description: 'Tips, tutorials, and insights about PDF management, document security, privacy, and productivity.',
        url: 'https://freedf.in/blog',
        type: 'website',
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}
