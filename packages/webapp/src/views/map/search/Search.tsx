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

import Cls from './Search.module.scss';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { NominatimResult } from '../../../core/geo/NominatimResult';
import ResultItem from './result/ResultItem';
import { Extent } from 'ol/extent';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';
import { useServices } from '../../../core/useServices';
import { resolveInAtLeast } from '../../../core/utils/resolveInAtLeast';
import { InlineLoader } from '../../../components/inline-loader/InlineLoader';

const logger = Logger.get('Search.tsx');

export interface State {
  query: string;
  results: NominatimResult[];
  loading: boolean;
}

const t = prefixedTranslation('MapView:');

function Search() {
  const { geo } = useServices();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [results, setResults] = useState<NominatimResult[]>([]);

  const search = useMemo(
    () =>
      debounce((query) => {
        setLoading(true);
        setTyping(false);

        resolveInAtLeast(geo.geocode(query), 600)
          .then((results) => {
            results.sort((res) => res.importance);
            setResults(results);
          })
          .catch((err) => logger.error('Error while geocoding: ', err))
          .finally(() => setLoading(false));
      }, 500),
    [geo]
  );

  const handleQueryChanged = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const query = ev.currentTarget.value;
      setQuery(query);
      setTyping(true);
      setResults([]);

      if (query) {
        search(query);
      }
    },
    [search]
  );

  const handleResultSelected = useCallback(
    (res: NominatimResult) => {
      const bbox = res.boundingbox.map((n) => parseFloat(n)) as [number, number, number, number];
      const extent: Extent = [bbox[2], bbox[0], bbox[3], bbox[1]];
      geo.getMainMap().moveViewToExtent(extent);
    },
    [geo]
  );

  return (
    <div className={`control-block`}>
      {/* Search input */}
      <div className={'control-item d-flex align-items-center mb-3'}>
        <input
          type={'text'}
          value={query}
          onChange={handleQueryChanged}
          placeholder={t('Search_for_a_place_or_an_address')}
          className={`form-control mr-3`}
          data-cy={'search-on-map'}
        />
        <InlineLoader size={2} active={loading} />
      </div>

      {/* Search results */}
      {query && (
        <>
          {!results.length && !typing && !loading && <div className={Cls.message}>{t('No_results')} 🤷</div>}
          {results.map((res) => (
            <ResultItem key={res.osm_id} result={res} onClick={handleResultSelected} />
          ))}
        </>
      )}
    </div>
  );
}

export default withTranslation()(Search);
