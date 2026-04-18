'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
    Calendar,
    Clock,
    ArrowLeft,
    Tag,
    ChevronRight,
    Facebook,
    Linkedin,
    Link as LinkIcon,
    Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/lib/blog';

interface BlogPostClientProps {
    post: BlogPost;
    relatedPosts: BlogPost[];
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
    const [copied, setCopied] = useState(false);

    const getShareUrl = () => {
        if (typeof window !== 'undefined') return window.location.href;
        return '';
    };

    const shareOnTwitter = () => {
        const url = getShareUrl();
        const text = encodeURIComponent(post.title);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
    };

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`, '_blank');
    };

    const shareOnLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`, '_blank');
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(getShareUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const formatText = (text: string): React.ReactNode => {
        const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
        return parts.map((part, index) => {
            const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (linkMatch) {
                const [, label, url] = linkMatch;
                return (
                    <Link key={index} href={url} className="text-primary hover:underline font-medium">
                        {label}
                    </Link>
                );
            }
            const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
            return (
                <span key={index}>
                    {boldParts.map((subPart, subIndex) => {
                        const boldMatch = subPart.match(/^\*\*([^*]+)\*\*$/);
                        if (boldMatch) {
                            return <strong key={subIndex} className="font-semibold text-foreground">{boldMatch[1]}</strong>;
                        }
                        return subPart;
                    })}
                </span>
            );
        });
    };

    const renderContent = (content: string) => {
        const lines = content.trim().split('\n');
        const elements: React.ReactNode[] = [];
        let inList = false;
        let listItems: string[] = [];

        const flushList = (keyPrefix: string) => {
            if (inList && listItems.length > 0) {
                elements.push(
                    <ul key={`${keyPrefix}-list`} className="mb-6 ml-6 list-disc space-y-2 text-muted-foreground">
                        {listItems.map((item, i) => (
                            <li key={i}>{formatText(item)}</li>
                        ))}
                    </ul>
                );
                listItems = [];
                inList = false;
            }
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('## ')) {
                flushList(`h2-${index}`);
                elements.push(
                    <h2 key={index} className="mb-4 mt-10 text-2xl font-bold text-foreground">
                        {trimmedLine.replace('## ', '')}
                    </h2>
                );
            } else if (trimmedLine.startsWith('### ')) {
                flushList(`h3-${index}`);
                elements.push(
                    <h3 key={index} className="mb-3 mt-8 text-xl font-semibold text-foreground">
                        {trimmedLine.replace('### ', '')}
                    </h3>
                );
            } else if (trimmedLine.startsWith('- ')) {
                inList = true;
                listItems.push(trimmedLine.replace('- ', ''));
            } else if (/^\d+\.\s/.test(trimmedLine)) {
                inList = true;
                listItems.push(trimmedLine.replace(/^\d+\.\s/, ''));
            } else if (trimmedLine.length > 0) {
                flushList(`p-${index}`);
                elements.push(
                    <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                        {formatText(trimmedLine)}
                    </p>
                );
            }
        });

        flushList('final');
        return elements;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative overflow-hidden border-b bg-linear-to-b from-primary/5 via-background to-background pt-24 pb-16">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px]"></div>
                </div>
                <div className="container relative z-10 mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mx-auto max-w-4xl">
                        {/* Breadcrumb */}
                        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
                        </nav>

                        {/* Category & Meta */}
                        <div className="mb-6 flex flex-wrap items-center gap-4">
                            <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground">
                                {post.category}
                            </Badge>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(post.date)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {post.readTime}
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                            {post.excerpt}
                        </p>

                        {/* Author & Share */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                                    F
                                </div>
                                <div>
                                    <p className="font-semibold">{post.author}</p>
                                    <p className="text-sm text-muted-foreground">Author</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-sm text-muted-foreground mr-2">Share:</span>
                                <Button size="icon" variant="ghost" className="h-9 w-9" onClick={shareOnTwitter} title="Share on X">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </Button>
                                <Button size="icon" variant="ghost" className="h-9 w-9" onClick={shareOnFacebook} title="Share on Facebook">
                                    <Facebook className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-9 w-9" onClick={shareOnLinkedIn} title="Share on LinkedIn">
                                    <Linkedin className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-9 w-9" onClick={copyLink} title="Copy link">
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl">
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="prose prose-lg max-w-none">
                            {renderContent(post.content)}
                        </motion.article>

                        {/* Tags */}
                        <div className="mt-12 border-t pt-8">
                            <div className="flex flex-wrap items-center gap-2">
                                <Tag className="h-5 w-5 text-muted-foreground" />
                                {post.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Back Link */}
                        <div className="mt-8">
                            <Button variant="outline" asChild>
                                <Link href="/blog">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Blog
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="border-t bg-muted/30 py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-10 text-center text-2xl font-bold">Related Articles</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedPosts.map((relPost) => (
                                <Link key={relPost.id} href={`/blog/${relPost.slug}`} className="group block">
                                    <div className="overflow-hidden border bg-card transition-all hover:border-primary hover:shadow-lg">
                                        <div className="relative aspect-16/10 overflow-hidden bg-muted">
                                            <Image
                                                src={relPost.image}
                                                alt={relPost.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <Badge variant="secondary" className="mb-3">
                                                {relPost.category}
                                            </Badge>
                                            <h3 className="mb-2 font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                                {relPost.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {relPost.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
