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
import { useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { IndexifyFunc, SearchIndex } from './SearchIndex';

interface Result<T> {
  search: (query: string) => void;
  results: T[];
}

/**
 * Search in features, does not use an index for the moment
 */
export function useIndexedSearch<T>(entries: T[], indexify: IndexifyFunc<T>): Result<T> {
  const [results, setResults] = useState<T[]>([]);
  const index = useMemo(() => new SearchIndex<T>(entries, indexify), [entries, indexify]);
  const search = useMemo(() => debounce((query: string) => setResults(index.search(query))), [index]);

  return {
    search,
    results,
  };
}
