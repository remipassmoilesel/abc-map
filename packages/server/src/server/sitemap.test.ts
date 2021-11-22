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
    const actual = generateSitemap('http://domain.fr', [Language.English, Language.French]);

    const expected = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">

        <url>
          <loc>http://domain.fr/</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/"/>
          <lastmod>0000-00-00</lastmod>
          <changefreq>monthly</changefreq>
          <priority>1.0</priority>
        </url>

        <url>
          <loc>http://domain.fr/documentation</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/documentation?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/documentation?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/documentation"/>
          <lastmod>0000-00-00</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.9</priority>
        </url>

        <url>
          <loc>http://domain.fr/funding</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/funding?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/funding?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/funding"/>
          <lastmod>0000-00-00</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>

        <url>
          <loc>http://domain.fr/map</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/map?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/map?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/map"/>
          <lastmod>0000-00-00</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>

        <url>
          <loc>http://domain.fr/legal-mentions</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/legal-mentions?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/legal-mentions?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/legal-mentions"/>
          <lastmod>0000-00-00</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>

        <url>
          <loc>http://domain.fr/datastore</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/datastore?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/datastore?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/datastore"/>
          <lastmod>0000-00-00</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>

        <url>
          <loc>http://domain.fr/layout</loc>
          <xhtml:link rel="alternate" hreflang="en" href="http://domain.fr/layout?lng=en"/>
          <xhtml:link rel="alternate" hreflang="fr" href="http://domain.fr/layout?lng=fr"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="http://domain.fr/layout"/>
          <lastmod>0000-00-00</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>

      </urlset>
    `;

    assert.equal(
      // We remove blank chars
      actual
        .replace(/\s/gi, '')
        // We replace last modification date
        .replace(/<lastmod>[0-9]{4}-[0-9]{2}-[0-9]{2}<\/lastmod>/gi, '<lastmod>0000-00-00</lastmod>'),
      expected.replace(/\s/gi, '')
    );
  });
});
