import { FrontendRoutes } from '@abc-map/shared';

export interface Url {
  loc: string;
  lastmod: string;
  changefreq: 'monthly';
  priority: number;
}

export const Sitemap: Url[] = [
  {
    loc: FrontendRoutes.landing().raw(),
    changefreq: 'monthly',
    lastmod: '2021-22-05',
    priority: 1,
  },
  {
    loc: FrontendRoutes.documentation().raw(),
    changefreq: 'monthly',
    lastmod: '2021-22-05',
    priority: 0.9,
  },
  {
    loc: FrontendRoutes.map().raw(),
    changefreq: 'monthly',
    lastmod: '2021-22-05',
    priority: 0.8,
  },
  {
    loc: FrontendRoutes.dataStore().raw(),
    changefreq: 'monthly',
    lastmod: '2021-22-05',
    priority: 0.7,
  },
  {
    loc: FrontendRoutes.dataStore().withoutOptionals(),
    changefreq: 'monthly',
    lastmod: '2021-22-05',
    priority: 0.6,
  },
  {
    loc: FrontendRoutes.layout().raw(),
    changefreq: 'monthly',
    lastmod: '2021-22-05',
    priority: 0.5,
  },
];

export function generateSitemap(baseUrl: string): string {
  const urls = Sitemap.map((url) => {
    return `
  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`;
  });

  return `\
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('')}
</urlset>
`;
}
