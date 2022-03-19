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

import Cls from './SharedMapView.module.scss';
import React, { useEffect, useState } from 'react';
import { pageSetup } from '../../core/utils/page-setup';
import { Link, useRouteMatch } from 'react-router-dom';
import { getAbcWindow, Logger, SharedMapParams } from '@abc-map/shared';
import { useServices } from '../../core/useServices';
import NavigationMenu from './navigation-menu/NavigationMenu';
import { MapFactory } from '../../core/geo/map/MapFactory';
import MainIcon from '../../assets/main-icon.svg';
import { Routes } from '../../routes';
import { prefixedTranslation } from '../../i18n/i18n';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { useActiveSharedView } from '../../core/project/useActiveSharedView';
import { MapUi } from '../../components/map-ui/MapUi';
import { E2eMapWrapper } from '../../core/geo/map/E2eMapWrapper';
import { resolveInAtLeast } from '../../core/utils/resolveInAtLeast';
import { withTranslation } from 'react-i18next';

export const logger = Logger.get('SharedMapView.tsx');

const t = prefixedTranslation('SharedMapView:');

function SharedMapView() {
  const { project, geo } = useServices();
  const match = useRouteMatch<SharedMapParams>();
  // Here we use a state for map because we have to re-render after map init
  const [map, setMap] = useState<MapWrapper | undefined>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const activeView = useActiveSharedView();

  // Setup page
  useEffect(() => {
    pageSetup(t('Shared_map'));

    if (!map) {
      const map = MapFactory.createDefault();
      setMap(map);
      getAbcWindow().abc.sharedMap = new E2eMapWrapper(map);
    }
    return () => map?.dispose();
  }, [map]);

  // Fetch and setup project
  useEffect(() => {
    const projectId = match.params.projectId;

    if (!map) {
      logger.debug('Cannot setup project, not ready', { map });
      return;
    }

    if (!projectId) {
      logger.error('Cannot show project, no id found');
      setError(true);
      return;
    }

    setError(false);
    setLoading(true);
    resolveInAtLeast(project.loadSharedProject(projectId), 1000)
      .then(() => map.importLayersFrom(geo.getMainMap(), { withSelection: false }))
      .catch((err) => {
        logger.error('Loading error: ', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [geo, map, match.params.projectId, project]);

  // Update map when active view change
  useEffect(() => {
    if (!map || !activeView) {
      logger.debug('Cannot update map view, not ready: ', { map, activeView });
      return;
    }

    // Apply layers visibility
    const layers = map.getLayers();
    for (const layerState of activeView.layers) {
      layers.find((lay) => lay.getId() === layerState.layerId)?.setVisible(layerState.visible);
    }
  }, [activeView, map, project]);

  return (
    <div className={Cls.sharedMap}>
      {!loading && !error && (
        <>
          <NavigationMenu attributions={map?.getTextAttributions() ?? []} />
          {activeView && map && <MapUi map={map} view={activeView?.view} data-testid={'shared-map'} className={Cls.map} data-cy={'shared-map'} />}
        </>
      )}

      {loading && !error && (
        <div className={Cls.textBlock}>
          <img src={MainIcon} alt={'Logo'} className={Cls.logo} />
          <h2>{t('Loading_map')}</h2>
        </div>
      )}

      {error && (
        <div className={Cls.textBlock} data-testid={'error'}>
          <img src={MainIcon} alt={'Logo'} className={Cls.logo} />
          <h2>{t('Cannot_display_map')}</h2>
          <div className={Cls.punchline}>
            {t('But_dont_panic_you_can_create_your_own')} <Link to={Routes.landing().format()}>Abc-Map</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default withTranslation()(SharedMapView);
