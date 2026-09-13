import type { MetadataRoute } from 'next';

import { allRoutes } from '@/config/navigation';
import { site } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return allRoutes.map((route) => ({
    url: `${site.url}${route === '/' ? '' : route}`,
    lastModified,
  }));
}
