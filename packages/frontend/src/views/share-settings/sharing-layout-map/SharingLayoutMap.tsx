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

import Cls from './SharingLayoutMap.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { AbcView, getAbcWindow, LayerState, Logger } from '@abc-map/shared';
import SideMenu from '../../../components/side-menu/SideMenu';
import { IconDefs } from '../../../components/icon/IconDefs';
import { useAppSelector } from '../../../core/store/hooks';
import { useServices } from '../../../core/useServices';
import SharingControls from './sharing-controls/SharingControls';
import { nanoid } from 'nanoid';
import SharedViewList from './shared-view-list/SharedViewList';
import { UpdateSharedViewsChangeset } from '../../../core/history/changesets/shared-views/UpdateSharedViewChangeset';
import { HistoryKey } from '../../../core/history/HistoryKey';
import isEqual from 'lodash/isEqual';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { AddSharedViewChangeset } from '../../../core/history/changesets/shared-views/AddSharedViewChangeset';
import { useActiveSharedView } from '../../../core/project/useActiveSharedView';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapUi } from '../../../components/map-ui/MapUi';
import { DimensionsPx } from '../../../core/utils/DimensionsPx';
import { E2eMapWrapper } from '../../../core/geo/map/E2eMapWrapper';
import { Views } from '../../../core/geo/Views';

const t = prefixedTranslation('ShareSettingsView:');

const logger = Logger.get('SharingLayoutMap');

function SharingLayoutMap() {
  const { project, geo, history } = useServices();
  const [map, setMap] = useState<MapWrapper>();
  const [{ width: mapWidth, height: mapHeight }, setMapDimensions] = useState<DimensionsPx>({ width: 0, height: 0 });
  const sharedViews = useAppSelector((st) => st.project.sharedViews.list);
  const activeView = useActiveSharedView();
  const [previewView, setPreviewView] = useState<AbcView>();

  // Setup map on mount
  useEffect(() => {
    if (!map) {
      const map = MapFactory.createDefault();
      setMap(map);
      getAbcWindow().abc.sharingLayoutMap = new E2eMapWrapper(map);
    }
  }, [geo, map]);

  // Update map dimensions for style ratio
  const handleMapSizeChanged = useCallback((d: DimensionsPx) => setMapDimensions(d), []);

  // Update map when visible layers change
  useEffect(() => {
    if (!map || !activeView?.layers) {
      logger.debug('Cannot update preview map, not ready');
      return;
    }

    const mainMap = geo.getMainMap();
    map.importLayersFrom(mainMap, { withSelection: false });

    const layers = map.getLayers();
    for (const layerState of activeView.layers) {
      layers.find((lay) => lay.getId() === layerState.layerId)?.setVisible(layerState.visible);
    }
  }, [activeView?.layers, geo, map]);

  // Set map view when active shared view change
  useEffect(() => {
    if (!activeView?.view || !map || !mapWidth || !mapHeight) {
      logger.debug('Cannot update map, reference not ready', { view: activeView?.view, map });
      return;
    }

    const updatedView = Views.normalize({
      resolution: activeView.view.resolution,
      projection: activeView.view.projection,
      center: activeView.view.center,
    });

    if (!isEqual(previewView, updatedView)) {
      setPreviewView(updatedView);
    }
  }, [project, activeView?.view, map, mapWidth, mapHeight, geo, previewView]);

  // Update view when user change map position
  const handleViewMove = useCallback(() => {
    const sharedView = project.getActiveSharedView();
    if (!map || !sharedView || !mapWidth || !mapHeight) {
      logger.error('Cannot register view, not ready', { map, sharedView, mapWidth, mapHeight });
      return;
    }

    const previewView = map.getView();
    const view: AbcView = Views.normalize({
      resolution: previewView.resolution,
      projection: previewView.projection,
      center: previewView.center,
    });

    if (!isEqual(sharedView.view, view)) {
      const cs = UpdateSharedViewsChangeset.create([{ before: sharedView, after: { ...sharedView, view } }]);
      cs.apply()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot update shared view: ', err));
    }
  }, [history, map, mapHeight, mapWidth, project]);

  const handleNewView = useCallback(() => {
    const add = async () => {
      // Create new view from main map
      const map = geo.getMainMap();
      const id = nanoid();
      const title = `${t('View')} ${sharedViews.length + 1}`;
      const layers = map
        .getLayers()
        .map((l) => ({ layerId: l.getId(), visible: true }))
        .filter((st): st is LayerState => !!st.layerId);

      const mapView = Views.normalize(map.getView());

      // Create change set, apply and register it
      const cs = AddSharedViewChangeset.create([{ id, title, view: mapView, layers }]);
      await cs.apply();
      history.register(HistoryKey.SharedViews, cs);
    };

    add().catch((err) => logger.error('Cannot add layer: ', err));
  }, [geo, history, sharedViews.length]);

  return (
    <>
      {/* View list */}
      <SideMenu
        menuId={'views/SharingLayoutMap-view-list'}
        menuPlacement={'left'}
        buttonIcon={IconDefs.faCopy}
        buttonStyle={{ top: '50vh', left: '2rem' }}
        title={t('View_list')}
      >
        <SharedViewList onNewView={handleNewView} />
      </SideMenu>

      {/* Preview map */}
      {map && (
        <MapUi
          map={map}
          view={previewView}
          onViewMove={handleViewMove}
          width={'65vw'}
          height={'65vh'}
          onSizeChange={handleMapSizeChanged}
          className={Cls.map}
          data-cy={'sharing-layout-map'}
        />
      )}

      {/* Controls on right */}
      <SideMenu
        menuId={'views/SharingLayoutMap-controls'}
        menuPlacement={'right'}
        buttonIcon={IconDefs.faCogs}
        buttonStyle={{ top: '50vh', right: '2rem' }}
        title={t('Configuration')}
        initiallyOpened={true}
      >
        <SharingControls onNewView={handleNewView} />
      </SideMenu>
    </>
  );
}

export default withTranslation()(SharingLayoutMap);
