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
import { generateSitemap } from './sitemap';
import { Language } from '@abc-map/shared';
import { assert } from 'chai';

describe('sitemap', () => {
  it('should return correct sitemap', () => {
    const sitemap = generateSitemap('http://domain.fr', [Language.English, Language.French]);

    assert.equal(
      sitemap.replace(/\s/gi, ''),
      `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">

        <url>
          <loc>http://domain.fr/</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/"/>
          <lastmod>2021-10-16</lastmod>
          <changefreq>monthly</changefreq>
          <priority>1</priority>
        </url>

        <url>
          <loc>http://domain.fr/documentation</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/documentation?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/documentation?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/documentation"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/documentation"/>
          <lastmod>2021-10-16</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.9</priority>
        </url>

        <url>
          <loc>http://domain.fr/funding</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/funding?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/funding?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/funding"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/funding"/>
          <lastmod>2021-10-16</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>

        <url>
          <loc>http://domain.fr/map</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/map?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/map?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/map"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/map"/>
          <lastmod>2021-10-16</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>

        <url>
          <loc>http://domain.fr/datastore</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/datastore?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/datastore?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/datastore"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/datastore"/>
          <lastmod>2021-10-16</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>

        <url>
          <loc>http://domain.fr/datastore</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/datastore?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/datastore?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/datastore"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/datastore"/>
          <lastmod>2021-10-16</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>

        <url>
          <loc>http://domain.fr/layout</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/layout?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/layout?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/layout"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/layout"/>
          <lastmod>2021-10-16</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>

        <url>
          <loc>http://domain.fr/legal-mentions</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/legal-mentions?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/legal-mentions?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/legal-mentions"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/legal-mentions"/>
          <lastmod>2021-10-16</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.2</priority>
        </url>

      </urlset>
    `.replace(/\s/gi, '')
    );
  });
});
