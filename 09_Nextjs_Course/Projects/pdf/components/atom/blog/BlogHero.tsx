'use client';

import { motion } from 'motion/react';
import { Search, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface BlogHeroProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export function BlogHero({ searchQuery, onSearchChange }: BlogHeroProps) {
    return (
        <section className="relative overflow-hidden border-b bg-linear-to-b from-primary/5 via-background to-background pt-24 pb-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px]"></div>
                <div className="absolute left-1/4 top-0 h-96 w-96 bg-primary/10 blur-[128px]"></div>
                <div className="absolute right-1/4 bottom-0 h-96 w-96 bg-blue-500/10 blur-[128px]"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-3xl text-center">
                    <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 bg-primary/5">
                        <TrendingUp className="mr-2 h-3.5 w-3.5" />
                        Latest Insights & Tutorials
                    </Badge>
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        <span className="bg-linear-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                            The Freedf Blog
                        </span>
                    </h1>
                    <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                        Expert tips, tutorials, and insights to help you master PDF management and boost your productivity.
                    </p>

                    {/* Search Bar */}
                    <div className="relative mx-auto max-w-xl">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="h-14 pl-12 pr-4 text-base bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
