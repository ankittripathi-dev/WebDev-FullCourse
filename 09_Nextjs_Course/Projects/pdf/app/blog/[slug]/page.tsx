import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts } from '@/lib/blog';
import BlogPostClient from '@/components/atom/blog/BlogPostClient';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const baseUrl = 'https://freedf.in';

    return {
        title: post.title,
        description: post.excerpt,
        keywords: post.tags.join(', '),
        authors: [{ name: post.author }],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `${baseUrl}/blog/${post.slug}`,
            siteName: 'Freedf',
            type: 'article',
            publishedTime: post.date,
            images: [
                {
                    url: `${baseUrl}${post.image}`,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [`${baseUrl}${post.image}`],
        },
        alternates: {
            canonical: `${baseUrl}/blog/${post.slug}`,
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = getRelatedPosts(slug, 3);

    return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}
