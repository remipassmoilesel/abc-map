/**
 * Copyright © 2023 Rémi Pace.
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

import { Language, WebappRoutes } from '@abc-map/shared';
import { DocumentationIndex } from '../../documentation/DocumentationIndex';
import { promises as fs } from 'fs';
import * as path from 'path';
import { DateTime } from 'luxon';
import { XMLBuilder } from 'fast-xml-parser';

const DefaultDocBlackList = ['/automated-test-target'];

interface SitemapContent {
  urlset: {
    url: Url[];
    '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9';
    '@_xmlns:xhtml': 'http://www.w3.org/1999/xhtml';
  };
}

interface Url {
  id: string;
  loc: string;
  '@_xhtml:link'?: Alternate[];
  lastmod: string;
  changefreq: 'monthly';
  priority: string;
}

interface Alternate {
  '@_rel': 'alternate';
  '@_hreflang': string;
  '@_href': string;
}

const routesEn = new WebappRoutes(Language.English);

export class Sitemap {
  public static create(baseUrl: string): Sitemap {
    const languages = Object.values(Language);
    return new Sitemap(baseUrl, languages, DocumentationIndex.get(), DefaultDocBlackList);
  }

  constructor(private baseUrl: string, private languages: Language[], private index: DocumentationIndex, private docBlackListPatterns: string[]) {}

  public async build(): Promise<string> {
    const stats = await fs.stat(path.resolve(__dirname, '../../../package.json'));
    const lastModification = DateTime.fromJSDate(stats.ctime).toISODate();

    const webAppUrls = this.getWebAppUrls(lastModification);
    const docUrls = await this.getStaticDocumentationUrls(lastModification);

    return this.buildXml(webAppUrls.concat(docUrls));
  }

  private getWebAppUrls(lastModification: string): Url[] {
    const urls: Url[] = [
      {
        id: routesEn.landing().raw(),
        loc: this.baseUrl + routesEn.landing().format(),
        changefreq: 'monthly',
        lastmod: lastModification,
        priority: '1.0', // decimal needed
      },
      {
        id: routesEn.map().raw(),
        loc: this.baseUrl + routesEn.map().format(),
        changefreq: 'monthly',
        lastmod: lastModification,
        priority: '0.9',
      },
      {
        id: routesEn.changelog().raw(),
        loc: this.baseUrl + routesEn.changelog().format(),
        changefreq: 'monthly',
        lastmod: lastModification,
        priority: '0.8',
      },
      {
        id: routesEn.funding().raw(),
        loc: this.baseUrl + routesEn.funding().format(),
        changefreq: 'monthly',
        lastmod: lastModification,
        priority: '0.7',
      },

      {
        id: routesEn.legalMentions().raw(),
        loc: this.baseUrl + routesEn.legalMentions().format(),
        changefreq: 'monthly',
        lastmod: lastModification,
        priority: '0.6',
      },
    ];

    const routesPerLang = this.languages.map((l) => new WebappRoutes(l));

    return urls.map<Url>((url) => {
      // We add alternates
      // We must add original link too, see https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap
      const alternates = routesPerLang
        .map<Alternate | null>((routes) => {
          const route = routes.getMainRoutes().find((r) => r.raw() === url.id);
          if (route) {
            return { '@_rel': 'alternate', '@_hreflang': route.getLang(), '@_href': this.baseUrl + route.format() };
          } else {
            return null;
          }
        })
        .filter((alt): alt is Alternate => !!alt);

      // We add default language
      alternates.push({ '@_rel': 'alternate', '@_hreflang': 'x-default', '@_href': url.loc });

      return { ...url, ['xhtml:link']: alternates };
    });
  }

  private async getStaticDocumentationUrls(lastModification: string): Promise<Url[]> {
    const entries = await this.index.getEntries();

    // First we build entries
    let urls = entries
      .map<Url | null>((entry) => {
        const isBlacklisted = !!this.docBlackListPatterns.find((pattern) => entry.match(pattern));
        if (isBlacklisted) {
          return null;
        }

        const id = entry.replace('index.html', '').replace(/^[a-z]{2}\//, ':lang/');
        return {
          id,
          loc: this.baseUrl + '/documentation/' + entry.replace('index.html', ''),
          changefreq: 'monthly',
          lastmod: lastModification,
          priority: '0.9',
        };
      })
      .filter((url): url is Url => !!url);

    // Then we add alternates
    // We must add original link too, see https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap
    urls = urls.map((urlA) => {
      return {
        ...urlA,
        ['xhtml:link']: urls
          .filter((urlB) => urlB.id === urlA.id)
          .map<Alternate>((urlB) => {
            const langMatch = urlB.loc.match(/\/([a-z]{2})\//);
            const hreflang = langMatch?.length ? langMatch[1] : 'en';
            return { '@_rel': 'alternate', '@_hreflang': hreflang, '@_href': urlB.loc };
          })
          .concat({ '@_rel': 'alternate', '@_hreflang': 'x-default', '@_href': urlA.loc }),
      };
    });

    return urls;
  }

  private buildXml = (urls: Url[]): string => {
    const builder = new XMLBuilder({
      attributeNamePrefix: '@_',
      ignoreAttributes: false,
      format: true,
    });

    const cleanUrls = urls.map((url) => {
      const copy: Partial<Url> = { ...url };
      delete copy.id;
      return copy;
    });

    const sitemapContent: SitemapContent = {
      urlset: {
        url: cleanUrls as Url[],
        '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        '@_xmlns:xhtml': 'http://www.w3.org/1999/xhtml',
      },
    };

    const header = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    return header + builder.build(sitemapContent);
  };
}
