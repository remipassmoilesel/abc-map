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

import { useEffect, useRef } from 'react';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { LayerState, Logger } from '@abc-map/shared';
import SideMenu from '../../../components/side-menu/SideMenu';
import { IconDefs } from '../../../components/icon/IconDefs';
import { useAppSelector } from '../../../core/store/hooks';
import { useServices } from '../../../core/useServices';
import SharingControls from './sharing-controls/SharingControls';
import { nanoid } from 'nanoid';
import SharedViewList from './shared-view-list/SharedViewList';
import Cls from './SharingLayoutMap.module.scss';
import { UpdateSharedViewsChangeset } from '../../../core/history/changesets/shared-views/UpdateSharedViewChangeset';
import { HistoryKey } from '../../../core/history/HistoryKey';
import isEqual from 'lodash/isEqual';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';

const t = prefixedTranslation('ShareSettingsView:');

const logger = Logger.get('SharingLayoutMap');

function SharingLayoutMap() {
  const { project, geo, history } = useServices();
  const previewMap = useRef(MapFactory.createDefault());
  const mapTarget = useRef<HTMLDivElement>(null);

  const sharedViews = useAppSelector((st) => st.project.sharedViews.list);
  const activeViewId = useAppSelector((st) => st.project.sharedViews.activeId);
  const activeView = activeViewId ? sharedViews.find((v) => v.id === activeViewId) : undefined;

  // Setup map on mount
  useEffect(() => {
    if (!mapTarget.current) {
      logger.error('Cannot display map, target not ready');
      return;
    }

    const mainMap = geo.getMainMap();
    previewMap.current.setTarget(mapTarget.current);
    previewMap.current.importLayersFrom(mainMap);
  }, [geo]);

  // Update map when visible layers change
  useEffect(() => {
    if (!previewMap.current || !activeView?.layers) {
      logger.error('Cannot update preview map, not ready');
      return;
    }

    const mainMap = geo.getMainMap();
    previewMap.current.importLayersFrom(mainMap);
    const layers = previewMap.current.getLayers();

    for (const layerState of activeView.layers) {
      layers.find((lay) => lay.getId() === layerState.layerId)?.setVisible(layerState.visible);
    }
  }, [activeView?.layers, geo]);

  // Create layout if none. This action is not undoable.
  useEffect(() => {
    if (!sharedViews.length) {
      const mainMap = geo.getMainMap();
      const id = nanoid();
      const layers: LayerState[] = mainMap
        .getLayers()
        .map((layer) => ({ layerId: layer.getId(), visible: true }))
        .filter((st): st is LayerState => !!st.layerId);
      project.addSharedViews([{ id, title: t('Main_view'), view: mainMap.getView(), layers }]);
      project.setActiveSharedView(id);
    }
  }, [geo, project, sharedViews.length]);

  // Set map view when active shared view changes
  useEffect(() => {
    if (!activeView) {
      return;
    }

    if (!previewMap.current) {
      logger.error('Cannot update map, reference not ready');
      return;
    }

    previewMap.current.setView(activeView.view);
  }, [activeViewId, project, activeView, activeView?.view]);

  // Update view when map position changes
  useEffect(() => {
    const map = previewMap.current;
    const listener = () => {
      const sharedViews = project.getActiveSharedView();
      if (!sharedViews) {
        logger.error('Active view not found');
        return;
      }

      const newView = map.getView();
      if (!isEqual(sharedViews.view, newView)) {
        const cs = UpdateSharedViewsChangeset.create([{ before: sharedViews, after: { ...sharedViews, view: map.getView() } }]);
        cs.apply()
          .then(() => history.register(HistoryKey.SharedViews, cs))
          .catch((err) => logger.error('Cannot update shared view: ', err));
      }
    };

    map.addViewMoveListener(listener);
    return () => map?.removeViewMoveListener(listener);
  }, [history, project]);

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
        <SharedViewList />
      </SideMenu>

      {/* Preview map */}
      <div ref={mapTarget} className={Cls.map} />

      {/* Controls on right */}
      <SideMenu
        menuId={'views/SharingLayoutMap-controls'}
        menuPlacement={'right'}
        buttonIcon={IconDefs.faCogs}
        buttonStyle={{ top: '50vh', right: '2rem' }}
        title={t('Configuration')}
      >
        <SharingControls />
      </SideMenu>
    </>
  );
}

export default withTranslation()(SharingLayoutMap);
