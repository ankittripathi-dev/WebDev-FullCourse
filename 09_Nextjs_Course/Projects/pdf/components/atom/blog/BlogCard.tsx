'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Calendar, Clock, Tag, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/lib/blog';

interface BlogCardProps {
    post: BlogPost;
    index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="group">
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="flex h-full flex-col overflow-hidden border bg-card transition-all hover:border-primary hover:shadow-xl">
                    {/* Image */}
                    <div className="relative aspect-16/10 overflow-hidden bg-muted">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 z-10">
                            <Badge className="bg-background/90 backdrop-blur-sm text-foreground hover:bg-background">
                                {post.category}
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                        <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(post.date)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {post.readTime}
                            </span>
                        </div>

                        <h3 className="mb-3 text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                        </h3>

                        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
                            {post.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="mb-4 flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                    <Tag className="mr-1 h-3 w-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Author & CTA */}
                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                    F
                                </div>
                                <span className="text-sm font-medium">{post.author}</span>
                            </div>
                            <span className="flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                                Read
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
