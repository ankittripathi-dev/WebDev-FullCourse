import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://freedf.in';

  // Core pages
  const routes = [
    '',
    '/about',
    '/blog',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Tool pages
  const tools = [
    '/tools/merge-pdf',
    '/tools/split-pdf',
    '/tools/compress-pdf',
    '/tools/organize-pdf',
    '/tools/remove-pages',
    '/tools/extract-pages',
    '/tools/repair-pdf',
    '/tools/rotate-pdf',
    '/tools/ocr-pdf',
    '/tools/jpg-to-pdf',
    '/tools/pdf-to-jpg',
    '/tools/add-page-numbers',
    '/tools/add-watermark',
    '/tools/crop-pdf',
    '/tools/unlock-pdf',
    '/tools/protect-pdf',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Blog posts
  const posts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...tools, ...posts];
}
