'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { getAllPosts, getFeaturedPosts, getAllCategories, BlogPost } from '@/lib/blog';
import {
    BlogHero,
    BlogCard,
    FeaturedPosts,
    BlogNewsletter,
    CategoryTabs,
} from '@/components/atom/blog';

export default function BlogPage() {
    const allPosts = getAllPosts();
    const featuredPosts = getFeaturedPosts();
    const categories = ['All', ...getAllCategories()];

    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter posts
    const filteredPosts = allPosts.filter((post) => {
        const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const showFeatured = searchQuery === '' && activeCategory === 'All';

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <BlogHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            {/* Featured Posts Section */}
            {showFeatured && <FeaturedPosts posts={featuredPosts} />}

            {/* Category Tabs & All Posts */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {/* Category Tabs */}
                    <CategoryTabs
                        categories={categories}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                    />

                    {/* Posts Grid */}
                    <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {filteredPosts.map((post, index) => (
                                <BlogCard key={post.id} post={post} index={index} />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* No Results */}
                    {filteredPosts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center  bg-muted">
                                <Search className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">No articles found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search or filter to find what you're looking for.
                            </p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <BlogNewsletter />
        </div>
    );
}
