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

import { withTranslation } from 'react-i18next';
import Cls from './SearchBar.module.scss';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import { InlineLoader } from '../../../components/inline-loader/InlineLoader';
import React, { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import { prefixedTranslation } from '../../../i18n/i18n';
import { ArtefactFilter } from '@abc-map/shared';

const t = prefixedTranslation('DataStoreView:');

interface Props {
  loading: boolean;
  onSearch: (query: string) => void;
  onFilterChange: (filter: ArtefactFilter) => void;
  onQueryChange: (query: string) => void;
  onClear: () => void;
}

function SearchBar(props: Props) {
  const { loading, onSearch, onFilterChange, onQueryChange, onClear } = props;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ArtefactFilter>(ArtefactFilter.All);

  // User clicks on search
  const handleClick = useCallback(() => onSearch(query), [onSearch, query]);

  // User types in search input
  const handleQueryChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setQuery(ev.target.value);
      onQueryChange(ev.target.value);
    },
    [onQueryChange]
  );

  // User types on 'Enter' key to search
  const handleKeyUp = useCallback(
    (ev: KeyboardEvent<HTMLInputElement>) => {
      if (ev.key === 'Enter') {
        onSearch(query);
      }
    },
    [onSearch, query]
  );

  // User clicks on clear button
  const handleClear = useCallback(() => {
    setQuery('');
    setFilter(ArtefactFilter.All);
    onClear();
  }, [onClear]);

  // User toggles filters
  const handleFilterChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const filter = ev.target.value as ArtefactFilter;
      setFilter(filter);
      onFilterChange(filter);
    },
    [onFilterChange]
  );

  return (
    <div className={Cls.searchBar}>
      {/* Search bar */}
      <div className={Cls.firstLine}>
        <input
          type={'text'}
          value={query}
          onChange={handleQueryChange}
          onKeyUp={handleKeyUp}
          placeholder={t('France_regions_world')}
          className={'form-control mr-2'}
          data-cy={'data-store-search'}
        />

        <button onClick={handleClick} className={'btn btn-primary'}>
          {t('Search')}
        </button>

        {/* Clear search button */}
        {(query || filter !== ArtefactFilter.All) && (
          <button className={'btn btn-outline-secondary mx-2'} onClick={handleClear}>
            <FaIcon icon={IconDefs.faTimes} />
          </button>
        )}

        <InlineLoader size={2} active={loading} />
      </div>

      {/* Filters */}
      <div className={Cls.secondLine}>
        <label className="form-check-label d-flex mr-3">
          <input
            type={'radio'}
            value={ArtefactFilter.All}
            checked={filter === ArtefactFilter.All}
            onChange={handleFilterChange}
            className={'form-check mr-2'}
          />
          {t('All')}
        </label>

        <label className="form-check-label d-flex mr-3">
          <input
            type={'radio'}
            value={ArtefactFilter.OnlyBaseMaps}
            checked={filter === ArtefactFilter.OnlyBaseMaps}
            onChange={handleFilterChange}
            className={'form-check mr-2'}
          />
          {t('Basemap')}
        </label>

        <label className="form-check-label d-flex mr-3">
          <input
            type={'radio'}
            value={ArtefactFilter.OnlyVectors}
            checked={filter === ArtefactFilter.OnlyVectors}
            onChange={handleFilterChange}
            className={'form-check mr-2'}
          />
          {t('Geometries')}
        </label>
      </div>
    </div>
  );
}

export default withTranslation()(SearchBar);
