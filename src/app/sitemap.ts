import type { MetadataRoute } from 'next';

const BASE_URL = 'https://bayar.dev';

/**
 * Date the page content last changed — deliberately not `new Date()`, which
 * would make every deploy look like a content update to a crawler.
 * Bump the entry when its page is edited.
 */
const LAST_MODIFIED = '2026-08-27';

const ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/docs', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: path === '/' ? BASE_URL : `${BASE_URL}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
  }));
}
