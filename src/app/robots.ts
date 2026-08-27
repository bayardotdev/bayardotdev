import type { MetadataRoute } from 'next';

const BASE_URL = 'https://bayar.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The chat endpoint is POST-only and rate limited; crawling it is pure
      // noise against the per-IP budget.
      disallow: '/api/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
