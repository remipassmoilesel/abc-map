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

import Cls from './ModuleIndexView.module.scss';
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ModuleCard } from './module-card/ModuleCard';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEssentialModules, useFavoriteModules, useLastModulesUsed, useModuleRegistry } from '../../core/modules/hooks';
import { Routes } from '../../routes';
import { Module } from '@abc-map/module-api';
import { FaIcon } from '../../components/icon/FaIcon';
import { IconDefs } from '../../components/icon/IconDefs';
import { UiActions } from '../../core/store/ui/actions';
import { useAppDispatch } from '../../core/store/hooks';
import { AddModuleModal } from './add-module-modal/AddModuleModal';
import { useTranslation } from 'react-i18next';
import { useSearchParamsModuleUrls } from './hooks';

export default function ModuleIndexView() {
  const { search } = useLocation();
  const registry = useModuleRegistry();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation('ModuleIndexView');

  useEffect(() => registry.updateSearchIndex(), [registry, i18n.language]);

  const [query, setQuery] = useState('');

  const [addModuleModal, setAddModuleModal] = useState(false);
  const showAddModuleModal = useCallback(() => setAddModuleModal(true), []);
  const hideAddModuleModal = useCallback(() => {
    setAddModuleModal(false);
    // When we hide modal, we reset eventual module urls in search parameters
    navigate({ pathname: Routes.moduleIndex().format(), search: '' });
  }, [navigate]);

  const searchParamsUrls = useSearchParamsModuleUrls();

  // Grab remote URLs from query string at init. Used for "Open in Abc-Map" button on module template.
  useEffect(() => {
    if (searchParamsUrls.length && !addModuleModal) {
      showAddModuleModal();
    }
  }, [addModuleModal, searchParamsUrls, showAddModuleModal]);

  // Handle user searches
  const handleQueryChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const newQuery = ev.target.value;
      setQuery(newQuery);
      navigate({ pathname: Routes.moduleIndex().format(), search: '?q=' + newQuery });
    },
    [navigate]
  );

  // Update search query when query parameters changes
  useEffect(() => {
    const params = new URLSearchParams(search);
    const newQuery = params.get('q');
    newQuery && newQuery !== query && setQuery(newQuery);
  }, [query, search]);

  const searchResults = useMemo(() => registry.search(query), [query, registry]);

  const handleKeyUp = useCallback(
    (ev: KeyboardEvent<HTMLInputElement>) => {
      if (ev.key === 'Enter' && searchResults.length === 1) {
        navigate(Routes.module().withParams({ moduleId: searchResults[0].getId() }));
      }
    },
    [navigate, searchResults]
  );

  const handleShowModule = useCallback(
    (mod: Module) => {
      navigate({ pathname: Routes.module().withParams({ moduleId: mod.getId() }) });
      setQuery('');
    },
    [navigate]
  );

  const handleRemoveModule = useCallback((mod: Module) => registry.unload(mod), [registry]);

  const essentialModules = useEssentialModules();
  const essentialModulesList = (
    <>
      <h2>{t('Essential_modules')}</h2>
      <div className={'d-flex flex-wrap mb-4'}>
        {essentialModules.map((module) => (
          <ModuleCard key={module.getId()} module={module} onOpen={handleShowModule} onRemove={handleRemoveModule} className={'mr-4 mb-4'} />
        ))}
      </div>
    </>
  );

  const allModules = registry.getModules();
  const allModulesList = (
    <>
      <h2>{t('All_modules')}</h2>
      <div className={'d-flex flex-wrap mb-4'}>
        {allModules.map((module) => (
          <ModuleCard key={module.getId()} module={module} onOpen={handleShowModule} onRemove={handleRemoveModule} className={'mr-4 mb-4'} />
        ))}
      </div>
    </>
  );

  const lastModulesUsed = useLastModulesUsed();
  const lastModulesUsedList = (
    <>
      <h2>{t('Last_modules_used')}</h2>
      <div className={'d-flex flex-wrap mb-4'}>
        {lastModulesUsed.map((module) => (
          <ModuleCard key={module.getId()} module={module} onOpen={handleShowModule} onRemove={handleRemoveModule} className={'mr-4 mb-4'} />
        ))}
      </div>
    </>
  );

  const handleRemoveRemoteModules = useCallback(() => registry.resetModules(), [registry]);

  const remoteModules = registry.getRemoteModules();
  const remoteModulesList = (
    <>
      <div className={'d-flex justify-content-start align-items-center'}>
        <h2 className={'mr-5'}>{t('Recently_loaded')}</h2>

        <button onClick={handleRemoveRemoteModules} className={'btn btn-outline-primary'}>
          <FaIcon icon={IconDefs.faBan} className={'mr-2'} /> {t('Remove_all')}
        </button>
      </div>
      <div className={'d-flex flex-wrap mb-4'}>
        {remoteModules.map((module) => (
          <ModuleCard key={module.getId()} module={module} onOpen={handleShowModule} onRemove={handleRemoveModule} className={'mr-4 mb-4'} />
        ))}
      </div>
    </>
  );

  const favoriteModules = useFavoriteModules();

  const handleRestoreFavorites = useCallback(() => {
    dispatch(UiActions.restoreDefaultFavoriteModules());
  }, [dispatch]);

  const restoreFavoritesButton = (
    <button onClick={handleRestoreFavorites} className={'btn btn-outline-primary'}>
      <FaIcon icon={IconDefs.faEraser} className={'mr-2'} /> {t('Restore_default_modules')}
    </button>
  );

  const favoriteModulesList = (
    <>
      <div className={'d-flex justify-content-start align-items-center'}>
        <h2 className={'mr-5'}>{t('Favorite_modules')}</h2>

        {restoreFavoritesButton}
      </div>
      <div className={'d-flex flex-wrap mb-4'}>
        {favoriteModules.map((module) => (
          <ModuleCard key={module.getId()} module={module} onOpen={handleShowModule} onRemove={handleRemoveModule} className={'mr-4 mb-4'} />
        ))}

        {!favoriteModules.length && <div>{t('Click_on_stars')}</div>}
      </div>
    </>
  );

  return (
    <div className={Cls.view}>
      <h1 className={'my-4'}>{t('Search_for_a_feature_or_module')}</h1>

      <input
        type={'text'}
        value={query}
        onInput={handleQueryChange}
        onKeyUp={handleKeyUp}
        placeholder={t('What_do_you_want_to_do')}
        className={clsx(Cls.searchField, 'form-control mb-4')}
        data-cy={'module-search'}
        autoFocus={true}
      />

      <div className={'d-flex flex-wrap align-items-center flex-wrap mb-3'}>
        <button onClick={showAddModuleModal} className={'btn btn-outline-primary me-2'} data-cy={'add-module-modal'}>
          <FaIcon icon={IconDefs.faPlus} /> {t('Add_a_module')}
        </button>

        <div className={'me-4'}>{restoreFavoritesButton}</div>

        <small>
          <FaIcon icon={IconDefs.faInfoCircle} className={'mr-2'} />
          {t('You_can_display_this_search_at_any_time_by_using_CTRL_M')}
        </small>
      </div>

      {/* Users search something */}
      {query && (
        <div className={'d-flex flex-column'} data-cy={'search-results'}>
          {!!searchResults.length && (
            <div className={'d-flex flex-wrap'}>
              {searchResults.map((module) => (
                <ModuleCard key={module.getId()} module={module} onOpen={handleShowModule} onRemove={handleRemoveModule} className={'mr-4 mb-4'} />
              ))}
            </div>
          )}

          {!searchResults.length && (
            <>
              <h3 className={'mt-3 mb-2'}>{t('Nothing_matches')}</h3>
              <h5 className={'mb-5'}>{t('Try_rephrasing_or_browse_the_features_below')}</h5>
              {essentialModulesList}
              {allModulesList}
            </>
          )}
        </div>
      )}

      {/* Users does not search */}
      {!query && (
        <div className={'d-flex flex-column'}>
          {essentialModulesList}
          {allModulesList}
          {!!lastModulesUsed.length && lastModulesUsedList}
          {favoriteModulesList}
          {!!remoteModules.length && remoteModulesList}
        </div>
      )}

      {addModuleModal && <AddModuleModal onHide={hideAddModuleModal} />}
    </div>
  );
}
