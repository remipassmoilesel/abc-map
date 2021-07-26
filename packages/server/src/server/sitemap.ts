/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

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
    lastmod: '2021-05-22',
    priority: 1,
  },
  {
    loc: FrontendRoutes.documentation().raw(),
    changefreq: 'monthly',
    lastmod: '2021-05-22',
    priority: 0.9,
  },
  {
    loc: FrontendRoutes.funding().raw(),
    changefreq: 'monthly',
    lastmod: '2021-05-22',
    priority: 0.8,
  },
  {
    loc: FrontendRoutes.map().raw(),
    changefreq: 'monthly',
    lastmod: '2021-05-22',
    priority: 0.8,
  },
  {
    loc: FrontendRoutes.dataStore().raw(),
    changefreq: 'monthly',
    lastmod: '2021-05-22',
    priority: 0.7,
  },
  {
    loc: FrontendRoutes.dataStore().withoutOptionals(),
    changefreq: 'monthly',
    lastmod: '2021-05-22',
    priority: 0.6,
  },
  {
    loc: FrontendRoutes.layout().raw(),
    changefreq: 'monthly',
    lastmod: '2021-05-22',
    priority: 0.5,
  },
  {
    loc: FrontendRoutes.legalMentions().raw(),
    changefreq: 'monthly',
    lastmod: '2021-05-22',
    priority: 0.2,
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
