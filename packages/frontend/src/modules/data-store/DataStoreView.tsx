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

import Cls from './DataStoreView.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { AbcArtefact, ArtefactFilter, Logger } from '@abc-map/shared';
import ArtefactCard from './artefact-card/ArtefactCard';
import NavigationBar from './navigation-bar/NavigationBar';
import { pageSetup } from '../../core/utils/page-setup';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { useServices } from '../../core/useServices';
import ArtefactDetails from './artefact-details/ArtefactDetails';
import SearchBar from './search-bar/SearchBar';
import { useOnlineStatus } from '../../core/pwa/OnlineStatusContext';
import { LargeOfflineIndicator } from '../../components/offline-indicator/LargeOfflineIndicator';

const logger = Logger.get('DataStoreView.tsx');

const t = prefixedTranslation('DataStoreModule:');

const PageSize = 12;

function DataStoreView() {
  const { dataStore } = useServices();
  // List of artefacts displayed in list
  const [artefacts, setArtefacts] = useState<AbcArtefact[]>([]);
  // Artefact displayed in detail panel, on right
  const [activeArtefact, setActiveArtefact] = useState<AbcArtefact>();
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(ArtefactFilter.All);
  const [query, setQuery] = useState('');
  const online = useOnlineStatus();

  // Details can be hidden on mobile device
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Page setup
  useEffect(() => pageSetup(t('Data_store'), t('Add_data_easily')), []);

  // List page on component mount or on demand
  const listArtefacts = useCallback(
    (filter: ArtefactFilter, offset: number) => {
      setSearching(false);
      setLoading(true);

      dataStore
        .listArtefacts(filter, PageSize, offset)
        .then((res) => {
          setOffset(res.offset);
          setTotal(res.total);
          setArtefacts(res.content);
        })
        .catch((err) => logger.error(err))
        .finally(() => setLoading(false));
    },
    [dataStore]
  );

  // Search artefacts on demand
  const searchArtefacts = useCallback(
    (query: string, filter: ArtefactFilter) => {
      setSearching(true);
      setLoading(true);

      dataStore
        .searchArtefacts(query, filter)
        .then((res) => setArtefacts(res.content))
        .catch((err) => logger.error(err))
        .finally(() => setLoading(false));
    },
    [dataStore]
  );

  // On mount we list artefacts
  useEffect(() => {
    if (online) {
      listArtefacts(ArtefactFilter.All, 0);
    }
  }, [listArtefacts, online]);

  // User clicks on navbar page list
  const handlePageChange = useCallback(
    (offset: number) => {
      setOffset(offset);
      listArtefacts(filter, offset);
    },
    [filter, listArtefacts]
  );

  // User clicks on search
  const handleRequest = useCallback(
    (query: string) => {
      if (query) {
        searchArtefacts(query, filter);
      } else {
        setOffset(0);
        listArtefacts(filter, 0);
      }
    },
    [filter, listArtefacts, searchArtefacts]
  );

  // User clicks on filter
  const handleFilterChange = useCallback(
    (filter: ArtefactFilter) => {
      setFilter(filter);
      if (query) {
        searchArtefacts(query, filter);
      } else {
        setOffset(0);
        listArtefacts(filter, 0);
      }
    },
    [listArtefacts, query, searchArtefacts]
  );

  const handleQueryChange = useCallback((query: string) => setQuery(query), []);

  // User clicks on "clear" button
  const handleClear = useCallback(() => {
    setQuery('');
    setFilter(ArtefactFilter.All);
    setOffset(0);
    listArtefacts(ArtefactFilter.All, 0);
  }, [listArtefacts]);

  // User clicks on artefact
  const handleArtefactSelected = useCallback((artefact: AbcArtefact) => {
    setActiveArtefact(artefact);
    setDetailsVisible(true);
  }, []);

  // User can hide details on mobile device
  const handleHideDetails = useCallback(() => setDetailsVisible(false), []);

  if (!online) {
    return (
      <LargeOfflineIndicator>
        <span dangerouslySetInnerHTML={{ __html: t('Connect_to_the_Internet_to_use_the_data_store') }} />
      </LargeOfflineIndicator>
    );
  }

  return (
    <div className={Cls.datastoreView}>
      {/* Left part with search bar and list */}
      <div className={Cls.leftPart}>
        <h1 className={'mb-3'}>{t('Data_store')}</h1>

        <SearchBar
          loading={loading}
          onSearch={handleRequest}
          onFilterChange={handleFilterChange}
          onQueryChange={handleQueryChange}
          onClear={handleClear}
          className={'mb-3'}
        />

        <div className={Cls.artefactList}>
          {artefacts.map((art, i) => {
            const selected = activeArtefact?.id === art.id;
            return <ArtefactCard key={i} selected={selected} artefact={art} onSelected={handleArtefactSelected} />;
          })}
          {!artefacts.length && !loading && <div className={'mx-3'}>{t('No_result')}</div>}
        </div>

        {!searching && (
          <div className={Cls.navigationBar}>
            <NavigationBar offset={offset} limit={PageSize} total={total} onClick={handlePageChange} />
          </div>
        )}
      </div>

      {/* Right part with artefact details, preview, ... */}
      <ArtefactDetails activeArtefact={activeArtefact} mobileVisible={detailsVisible} mobileOnHide={handleHideDetails} className={Cls.rightPart} />
    </div>
  );
}

export default withTranslation()(DataStoreView);
