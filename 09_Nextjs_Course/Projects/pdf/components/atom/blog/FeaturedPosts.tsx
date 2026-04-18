'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Calendar, Clock, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/lib/blog';

interface FeaturedPostsProps {
    posts: BlogPost[];
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
    if (posts.length === 0) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <section className="border-b py-16">
            <div className="container mx-auto px-4">
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bookmark className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Featured Articles</h2>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Featured Post */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2">
                        <Link href={`/blog/${posts[0].slug}`} className="group block">
                            <div className="relative aspect-video overflow-hidden bg-muted">
                                <Image
                                    src={posts[0].image}
                                    alt={posts[0].title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />
                                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 lg:p-8">
                                    <Badge className="mb-4 bg-primary/90 hover:bg-primary text-primary-foreground">
                                        {posts[0].category}
                                    </Badge>
                                    <h3 className="mb-3 text-2xl font-bold text-white lg:text-3xl group-hover:text-primary transition-colors">
                                        {posts[0].title}
                                    </h3>
                                    <p className="mb-4 text-white/80 line-clamp-2 max-w-2xl">
                                        {posts[0].excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-white/70">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(posts[0].date)}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            {posts[0].readTime}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Secondary Featured Posts */}
                    <div className="flex flex-col gap-6">
                        {posts.slice(1, 3).map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}>
                                <Link href={`/blog/${post.slug}`} className="group block">
                                    <div className="relative overflow-hidden border bg-card p-5 transition-all hover:border-primary hover:shadow-lg">
                                        <Badge variant="secondary" className="mb-3">
                                            {post.category}
                                        </Badge>
                                        <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatDate(post.date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {post.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
