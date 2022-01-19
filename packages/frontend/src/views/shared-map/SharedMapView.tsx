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
import React, { useEffect, useRef, useState } from 'react';
import { pageSetup } from '../../core/utils/page-setup';
import { Link, useRouteMatch } from 'react-router-dom';
import { Logger, SharedMapParams } from '@abc-map/shared';
import { useServices } from '../../core/useServices';
import NavigationMenu from './navigation-menu/NavigationMenu';
import { useAppSelector } from '../../core/store/hooks';
import { MapFactory } from '../../core/geo/map/MapFactory';
import MainIcon from '../../assets/main-icon.svg';
import { Routes } from '../../routes';
import { prefixedTranslation } from '../../i18n/i18n';

const logger = Logger.get('SharedMapView.tsx');

const t = prefixedTranslation('SharedMapView:');

export function SharedMapView() {
  const { project, geo } = useServices();
  const match = useRouteMatch<SharedMapParams>();
  const mapRef = useRef(MapFactory.createDefault());
  const mapSupportRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState(false);
  const activeViewId = useAppSelector((st) => st.project.sharedViews.activeId);

  // Setup page
  useEffect(() => pageSetup(t('Shared_map')), []);

  // Fetch and setup project
  useEffect(() => {
    const map = mapRef.current;
    const mapSupport = mapSupportRef.current;
    const projectId = match.params.projectId;
    if (!map || !projectId || !mapSupport) {
      logger.error('Cannot show project, not ready: ', { map, projectId, mapSupport });
      setError(true);
      return;
    }

    project
      .loadRemoteProject(projectId)
      .then(() => {
        map.setTarget(mapSupport);
        map.importLayersFrom(geo.getMainMap());
      })
      .catch((err) => {
        logger.error('Loading error: ', err);
        setError(true);
      });

    return () => map.setTarget(undefined);
  }, [geo, match.params.projectId, project]);

  // Update map when active view change
  useEffect(() => {
    const map = mapRef.current;
    const activeView = project.getActiveSharedView();
    if (!map || !activeView) {
      logger.error('Cannot set view, not ready: ', { map, activeView });
      return;
    }

    // Apply view
    map.setView(activeView.view);

    // Apply layers visibility
    const layers = map.getLayers();
    for (const layerState of activeView.layers) {
      layers.find((lay) => lay.getId() === layerState.layerId)?.setVisible(layerState.visible);
    }
  }, [activeViewId, project]);

  return (
    <div className={Cls.sharedMap}>
      {!error && (
        <>
          <NavigationMenu />
          <div ref={mapSupportRef} className={Cls.map} />
        </>
      )}

      {error && (
        <div className={Cls.error}>
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
