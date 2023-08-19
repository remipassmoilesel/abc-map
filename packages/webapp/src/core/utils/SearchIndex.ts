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

import UFuzzy from '@leeoniya/ufuzzy';
import { Logger } from '@abc-map/shared';

export type IndexifyFunc<T> = (item: T) => string[];

const logger = Logger.get('SearchIndex.ts');

export function disableSearchIndexLogging() {
  logger.disable();
}

export class SearchIndex<T> {
  private entries: T[] = [];
  private haystack: string[] = [];

  constructor(entries: T[], indexify: IndexifyFunc<T>) {
    const start = Date.now();

    this.entries = [];
    this.haystack = [];

    for (const entry of entries) {
      const key = indexify(entry).join('|');
      this.entries.push(entry);
      this.haystack.push(key);
    }

    logger.debug('Index build took ' + (Date.now() - start) + 'ms');
  }

  public search(query: string): T[] {
    const start = Date.now();

    const fuzzy = new UFuzzy({});
    const [, info, order] = fuzzy.search(this.haystack, query);
    if (!info || !order) {
      return [];
    }

    const results = order
      .slice(0, 20)
      .map((order) => {
        const entryIndex = info.idx[order];
        return this.entries[entryIndex];
      })
      .filter((res): res is T => !!res);

    logger.debug('Search took ' + (Date.now() - start) + 'ms');
    return results;
  }
}
