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

import { FrontendRoutes, Language, Route } from '@abc-map/shared';

export interface Url {
  routeEn: Route<any>;
  lastmod: string;
  changefreq: 'monthly';
  priority: string;
}

const routesEn = new FrontendRoutes(Language.English);

const Sitemap: Url[] = [
  {
    routeEn: routesEn.landing(),
    changefreq: 'monthly',
    lastmod: '2022-01-04',
    priority: '1.0', // decimal needed
  },
  {
    routeEn: routesEn.documentation(),
    changefreq: 'monthly',
    lastmod: '2022-01-04',
    priority: '0.9',
  },
  {
    routeEn: routesEn.changelog(),
    changefreq: 'monthly',
    lastmod: '2022-05-18',
    priority: '0.9',
  },
  {
    routeEn: routesEn.funding(),
    changefreq: 'monthly',
    lastmod: '2022-01-04',
    priority: '0.8',
  },
  {
    routeEn: routesEn.map(),
    changefreq: 'monthly',
    lastmod: '2022-01-04',
    priority: '0.8',
  },
  {
    routeEn: routesEn.legalMentions(),
    changefreq: 'monthly',
    lastmod: '2022-01-04',
    priority: '0.7',
  },
  {
    routeEn: routesEn.dataStore(),
    changefreq: 'monthly',
    lastmod: '2022-01-04',
    priority: '0.6',
  },
  {
    routeEn: routesEn.shareSettings(),
    changefreq: 'monthly',
    lastmod: '2022-01-04',
    priority: '0.5',
  },
  {
    routeEn: routesEn.export(),
    changefreq: 'monthly',
    lastmod: '2022-01-04',
    priority: '0.5',
  },
];

export function generateSitemap(baseUrl: string, languages: Language[]): string {
  const alternativeRoutes = languages.map((l) => new FrontendRoutes(l));

  // For each URL we create a <URL> block
  const urls = Sitemap.map((url) => {
    const locEn = `${baseUrl}${url.routeEn.format()}`;

    // We add alternative languages
    const alternates = alternativeRoutes
      .map((routes) => {
        const r = routes.getAll().find((r) => r.raw() === url.routeEn.raw());
        if (r) {
          return `<xhtml:link rel="alternate" hreflang="${r.getLang()}" href="${baseUrl}${r.format()}"/>`;
        } else {
          return null;
        }
      })
      .filter((alt) => !!alt);

    // We add default language
    alternates.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${locEn}"/>`);

    return `
  <url>
    <loc>${locEn}</loc>
    ${alternates.join('\n    ')}
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`;
  });

  // Then we concat all
  return `\
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${urls.join('')}
</urlset>
`;
}
