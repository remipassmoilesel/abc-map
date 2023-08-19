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

import { useTranslation } from 'react-i18next';
import Cls from './Header.module.scss';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import React, { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import { ArtefactFilter } from '@abc-map/shared';
import clsx from 'clsx';
import NavigationBar from './NavigationBar';

interface Props {
  onSearch: (query: string) => void;
  onFilterChange: (filter: ArtefactFilter) => void;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  offset: number;
  limit: number;
  total: number;
  onOffsetChange: (offset: number) => void;
  className?: string;
}

export function Header(props: Props) {
  const { t } = useTranslation('DataStoreModule');
  const { onSearch, onFilterChange, onQueryChange, onClear, offset, limit, total, onOffsetChange, className } = props;
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
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const filter = ev.target.value as ArtefactFilter;
      setFilter(filter);
      onFilterChange(filter);
    },
    [onFilterChange]
  );

  return (
    <div className={clsx(Cls.header, className)}>
      <div className={'d-flex mb-2 me-4'}>
        <input
          type={'text'}
          value={query}
          onChange={handleQueryChange}
          onKeyUp={handleKeyUp}
          placeholder={t('France_regions_world')}
          className={'form-control mr-2'}
          data-cy={'data-store-search'}
          autoFocus={true}
        />

        <button onClick={handleClick} className={'btn btn-primary me-2'}>
          {t('Search')}
        </button>

        {/* Clear search button */}
        <button onClick={handleClear} disabled={!query && filter === ArtefactFilter.All} className={'btn btn-outline-secondary'}>
          <FaIcon icon={IconDefs.faTimes} />
        </button>
      </div>

      <NavigationBar maxButtons={5} offset={offset} limit={limit} total={total} onChange={onOffsetChange} className={'mb-2 me-4'} />

      <div className={'mb-2'}>
        <select value={filter} onChange={handleFilterChange} className={'form-select'}>
          <option value={ArtefactFilter.All}>{t('Display_all')}</option>
          <option value={ArtefactFilter.OnlyBaseMaps}>{t('Basemap')}</option>
          <option value={ArtefactFilter.OnlyVectors}>{t('Geometries')}</option>
        </select>
      </div>
    </div>
  );
}
