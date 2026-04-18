import posts from '@/data/blog/posts';

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    category: string;
    tags: string[];
    image: string;
    readTime: string;
    featured?: boolean;
}

export function getAllPosts(): BlogPost[] {
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedPosts(): BlogPost[] {
    return posts.filter(post => post.featured).slice(0, 3);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
    return posts.find(post => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
    return posts.filter(post => post.category === category);
}

export function getAllCategories(): string[] {
    const categories = posts.map(post => post.category);
    return [...new Set(categories)];
}

export function getAllTags(): string[] {
    const tags = posts.flatMap(post => post.tags);
    return [...new Set(tags)];
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
    const currentPost = getPostBySlug(currentSlug);
    if (!currentPost) return [];

    return posts
        .filter(post => post.slug !== currentSlug)
        .filter(post =>
            post.category === currentPost.category ||
            post.tags.some(tag => currentPost.tags.includes(tag))
        )
        .slice(0, limit);
}
