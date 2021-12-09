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

import React, { useCallback, useEffect, useRef, useState } from 'react';
import MainMap from './main-map/MainMap';
import LayerControls from './layer-controls/LayerControls';
import ProjectStatus from './project-status/ProjectStatus';
import { Logger } from '@abc-map/shared';
import ProjectControls from './project-controls/ProjectControls';
import ToolSelector from './tool-selector/ToolSelector';
import HistoryControls from '../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../core/history/HistoryKey';
import { LayerWrapper } from '../../core/geo/layers/LayerWrapper';
import Search from './search/Search';
import ImportData from './import-data/ImportData';
import CursorPosition from './cursor-position/CursorPosition';
import { MapKeyboardListener } from './keyboard-listener/MapKeyboardListener';
import { pageSetup } from '../../core/utils/page-setup';
import { MapActions } from '../../core/store/map/actions';
import { MapSizeChangedEvent } from '../../core/geo/map/MapWrapper.events';
import { withTranslation } from 'react-i18next';
import { prefixedTranslation } from '../../i18n/i18n';
import { IconDefs } from '../../components/icon/IconDefs';
import SideMenu from '../../components/side-menu/SideMenu';
import { useAppDispatch, useAppSelector } from '../../core/store/hooks';
import { useServices } from '../../core/hooks';
import { FullscreenButton } from './fullscreen-button/FullscreenButton';
import Cls from './MapView.module.scss';

const logger = Logger.get('MapView.tsx');

const t = prefixedTranslation('MapView:');

function MapView() {
  const { geo } = useServices();
  const keyboardListener = useRef<MapKeyboardListener | undefined>();
  const mapDimensions = useAppSelector((st) => st.map.mainMapDimensions);
  const dispatch = useAppDispatch();

  const [layers, setLayers] = useState<LayerWrapper[]>([]);
  const [activeLayer, setActiveLayer] = useState<LayerWrapper | undefined>();

  // When layer list change we set a state with list of layers and active layer
  const handleLayerChange = useCallback(() => {
    logger.debug('Layers changed');
    const map = geo.getMainMap();

    setLayers(map.getLayers());
    setActiveLayer(map.getActiveLayer());
  }, [geo]);

  /**
   * Here we set main map size in store for later exports.
   *
   * We keep only the biggest size in order to keep consistent exports event if window was resized.
   *
   * @param ev
   */
  const handleMapSizeChange = useCallback(
    (ev: MapSizeChangedEvent) => {
      const width = ev.dimensions.width;
      const height = ev.dimensions.height;
      const previousWidth = mapDimensions?.width || 0;
      const previousHeight = mapDimensions?.height || 0;
      if (width > previousWidth || height > previousHeight) {
        dispatch(MapActions.setMainMapDimensions(width, height));
      }
    },
    [dispatch, mapDimensions?.height, mapDimensions?.width]
  );

  useEffect(() => {
    pageSetup(t('The_map'), t('Visualize_and_create_in_your_browser'));

    const map = geo.getMainMap();
    map.addSizeListener(handleMapSizeChange);
    map.addLayerChangeListener(handleLayerChange);
    handleLayerChange(); // We trigger manually the first event for setup

    keyboardListener.current = MapKeyboardListener.create();
    keyboardListener.current.initialize();

    return () => {
      map.removeSizeListener(handleMapSizeChange);
      map.removeLayerChangeListener(handleLayerChange);

      keyboardListener.current?.destroy();
    };
  }, [geo, handleLayerChange, handleMapSizeChange]);

  return (
    <div className={Cls.mapView}>
      {/* Toggle fullscreen button */}
      <FullscreenButton style={{ top: '20vmin', left: '2vw' }} />

      {/* Search menu */}
      <SideMenu
        title={t('Search_menu')}
        buttonIcon={IconDefs.faSearch}
        buttonStyle={{ top: '35vmin', left: '2vw' }}
        menuPlacement={'left'}
        menuId={'mapview-search-menu'}
        data-cy={'search-menu'}
      >
        <div className={Cls.spacer} />
        <Search />
        <div className={'flex-grow-1'} />
        <CursorPosition />
        <div className={Cls.spacer} />
      </SideMenu>

      {/* Project menu */}
      <SideMenu
        title={t('Project_menu')}
        buttonIcon={IconDefs.faFileAlt}
        buttonStyle={{ top: '50vmin', left: '2vw' }}
        menuPlacement={'left'}
        menuId={'mapview-project-menu'}
        data-cy={'project-menu'}
      >
        <div className={Cls.spacer} />
        <ProjectStatus />
        <ProjectControls />
        <ImportData />
        <div className={'flex-grow-1'} />
        <div className={Cls.spacer} />
      </SideMenu>

      {/*Main map*/}
      <MainMap />

      {/* Draw menu */}
      <SideMenu
        title={t('Draw_menu')}
        buttonIcon={IconDefs.faDraftingCompass}
        buttonStyle={{ top: '20vmin', right: '2vw' }}
        menuPlacement={'right'}
        menuId={'mapview-draw-menu'}
        data-cy={'draw-menu'}
      >
        <HistoryControls historyKey={HistoryKey.Map} />
        <LayerControls layers={layers} />
        <ToolSelector activeLayer={activeLayer} />
      </SideMenu>
    </div>
  );
}

export default withTranslation()(MapView);
