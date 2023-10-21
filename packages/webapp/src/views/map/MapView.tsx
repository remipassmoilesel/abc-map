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

import Cls from './MapView.module.scss';
import React, { useEffect } from 'react';
import MainMap from './main-map/MainMap';
import { LayerControls } from './layer-controls/LayerControls';
import { Logger } from '@abc-map/shared';
import ToolSelector from './tool-selector/ToolSelector';
import HistoryControls from '../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../core/history/HistoryKey';
import Search from './search/Search';
import { ImportData } from './import-data/ImportData';
import CursorPosition from './cursor-position/CursorPosition';
import { MainMapKeyboardListener } from './MainMapKeyboardListener';
import { pageSetup } from '../../core/utils/page-setup';
import { useTranslation, withTranslation } from 'react-i18next';
import { IconDefs } from '../../components/icon/IconDefs';
import SideMenu from '../../components/side-menu/SideMenu';
import { useServices } from '../../core/useServices';
import { FullscreenButton } from './fullscreen-button/FullscreenButton';
import { isDesktopDevice } from '../../core/ui/isDesktopDevice';
import { MapGeolocation } from './geolocation/MapGeolocation';
import { useMapLayers } from '../../core/geo/useMapLayers';
import { FeatureExplorer } from './feature-exporer/FeatureExplorer';

const logger = Logger.get('MapView.tsx');

function MapView() {
  const { geo } = useServices();
  const { activeLayer } = useMapLayers();
  const { t } = useTranslation('MapView');

  // Page title
  useEffect(() => pageSetup(t('The_map'), t('Visualize_and_create_in_your_browser')), [t]);

  // Keyboard shortcuts
  useEffect(() => {
    const listener = MainMapKeyboardListener.create();
    listener.initialize();

    return () => listener.destroy();
  }, []);

  return (
    <div className={Cls.mapView}>
      {/* Toggle fullscreen button */}
      <FullscreenButton style={{ top: '25vh', left: '2vw' }} />

      {/* Position controls */}
      <SideMenu
        title={t('Position')}
        buttonIcon={IconDefs.faCrosshairs}
        buttonStyle={{ top: '35vh', left: '2vw' }}
        menuPlacement={'left'}
        menuId={'views/MapView-position'}
        data-cy={'position-menu'}
      >
        <div className={Cls.spacer} />
        <CursorPosition />
        <div className={Cls.spacer} />
        <MapGeolocation map={geo.getMainMap()} />
      </SideMenu>

      {/* Search menu */}
      <SideMenu
        title={t('Search_menu')}
        buttonIcon={IconDefs.faSearch}
        buttonStyle={{ top: '45vh', left: '2vw' }}
        menuPlacement={'left'}
        menuId={'views/MapView-search'}
        data-cy={'search-menu'}
      >
        <div className={Cls.spacer} />
        <Search />
      </SideMenu>

      {/* Import data menu */}
      <SideMenu
        title={t('Import_data')}
        buttonIcon={IconDefs.faUpload}
        buttonStyle={{ top: '55vh', left: '2vw' }}
        menuPlacement={'left'}
        menuId={'views/MapView-import-data'}
        data-cy={'data-menu'}
      >
        <div className={Cls.spacer} />
        <ImportData />
      </SideMenu>

      {/* Feature explorer menu */}
      <SideMenu
        title={t('Feature_explorer')}
        buttonIcon={IconDefs.faTable}
        buttonStyle={{ top: '65vh', left: '2vw' }}
        menuPlacement={'left'}
        menuId={'views/MapView-feature-explorer'}
        data-cy={'feature-explorer'}
      >
        <FeatureExplorer />
      </SideMenu>

      {/* Main map */}
      <MainMap />

      {/* Draw menu */}
      <SideMenu
        title={t('Draw_menu')}
        buttonIcon={IconDefs.faDraftingCompass}
        buttonStyle={{ top: '45vh', right: '2vw' }}
        menuPlacement={'right'}
        menuId={'views/MapView-draw'}
        initiallyOpened={isDesktopDevice()}
        data-cy={'draw-menu'}
      >
        <HistoryControls historyKey={HistoryKey.Map} />
        <LayerControls />
        <ToolSelector activeLayer={activeLayer} />
      </SideMenu>
    </div>
  );
}

export default withTranslation()(MapView);
