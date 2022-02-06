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
import { AbcSharedView, AbcView, getAbcWindow, LayerState, Logger } from '@abc-map/shared';
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
import { LegendFactory } from '../../../core/project/LegendFactory';
import { useActiveSharedView } from '../../../core/project/useActiveSharedView';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapLegend } from '../../../components/map-legend/MapLegend';
import { MapUi } from '../../../components/map-ui/MapUi';
import { DimensionsPx } from '../../../core/utils/DimensionsPx';
import { toPrecision } from '../../../core/utils/numbers';
import { E2eMapWrapper } from '../../../core/geo/map/E2eMapWrapper';

const t = prefixedTranslation('ShareSettingsView:');

const logger = Logger.get('SharingLayoutMap');

function SharingLayoutMap() {
  const { project, geo, history } = useServices();
  const [map, setMap] = useState<MapWrapper>();
  const [styleRatio, setStyleRatio] = useState(1);
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

  // Compute style ratio
  useEffect(() => {
    if (!mapWidth || !mapHeight) {
      return;
    }

    const ratio = geo.getMainMap().getMainRatio(mapWidth, mapHeight);
    setStyleRatio(ratio);
  }, [mapWidth, mapHeight, geo]);

  // Update map when visible layers change
  useEffect(() => {
    if (!map || !activeView?.layers) {
      logger.debug('Cannot update preview map, not ready');
      return;
    }

    const mainMap = geo.getMainMap();
    map.importLayersFrom(mainMap, { withSelection: false, ratio: styleRatio });

    const layers = map.getLayers();
    for (const layerState of activeView.layers) {
      layers.find((lay) => lay.getId() === layerState.layerId)?.setVisible(layerState.visible);
    }
  }, [activeView?.layers, geo, map, styleRatio]);

  // Set map view when active shared view change
  useEffect(() => {
    if (!activeView?.view || !map || !mapWidth || !mapHeight) {
      logger.debug('Cannot update map, reference not ready', { view: activeView?.view, map });
      return;
    }

    const ratio = geo.getMainMap().getMainRatio(mapWidth, mapHeight);
    const updatedView = {
      resolution: toPrecision(activeView.view.resolution / ratio, 9),
      projection: activeView.view.projection,
      center: activeView.view.center.slice(),
    };

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

    const ratio = geo.getMainMap().getMainRatio(mapWidth, mapHeight);
    const previewView = map.getView();
    const view: AbcView = {
      resolution: toPrecision(previewView.resolution * ratio, 9),
      projection: previewView.projection,
      center: previewView.center.slice(),
    };

    if (!isEqual(sharedView.view, view)) {
      const cs = UpdateSharedViewsChangeset.create([{ before: sharedView, after: { ...sharedView, view } }]);
      cs.apply()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot update shared view: ', err));
    }
  }, [geo, history, map, mapHeight, mapWidth, project]);

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
      const view: AbcSharedView = { id, title, view: map.getView(), layers, legend: LegendFactory.newEmptyLegend() };

      // Create change set, apply and register it
      const cs = AddSharedViewChangeset.create([view]);
      await cs.apply();
      history.register(HistoryKey.SharedViews, cs);

      // Set new layer as active
      project.setActiveSharedView(id);
    };

    add().catch((err) => logger.error('Cannot add layer: ', err));
  }, [geo, history, project, sharedViews.length]);

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
      {activeView && map && <MapLegend legend={activeView.legend} map={map} ratio={styleRatio} />}

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
