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

import Cls from './MapView.module.scss';
import React, { useCallback, useEffect } from 'react';
import MainMap from './main-map/MainMap';
import LayerControls from './layer-controls/LayerControls';
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
import { FaIcon } from '../../components/icon/FaIcon';
import { Routes } from '../../routes';
import { LocalModuleId } from '../../modules/LocalModuleId';
import { useNavigate } from 'react-router-dom';

const logger = Logger.get('MapView.tsx');

function MapView() {
  const { geo } = useServices();
  const { layers, activeLayer } = useMapLayers();
  const { t } = useTranslation('MapView');
  const navigate = useNavigate();

  // Page title
  useEffect(() => pageSetup(t('The_map'), t('Visualize_and_create_in_your_browser')), [t]);

  // Keyboard shortcuts
  useEffect(() => {
    const listener = MainMapKeyboardListener.create();
    listener.initialize();

    return () => listener.destroy();
  }, []);

  const handleShowProjectManagement = useCallback(() => navigate(Routes.module().withParams({ moduleId: LocalModuleId.ProjectManagement })), [navigate]);

  return (
    <div className={Cls.mapView}>
      {/* Toggle fullscreen button */}
      <FullscreenButton style={{ top: '30vh', left: '2vw' }} />

      {/* Position controls */}
      <SideMenu
        title={t('Position')}
        buttonIcon={IconDefs.faCrosshairs}
        buttonStyle={{ top: '40vh', left: '2vw' }}
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
        buttonStyle={{ top: '50vh', left: '2vw' }}
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
        buttonIcon={IconDefs.faTable}
        buttonStyle={{ top: '60vh', left: '2vw' }}
        menuPlacement={'left'}
        menuId={'views/MapView-data'}
        data-cy={'data-menu'}
      >
        <div className={Cls.spacer} />
        <ImportData />

        {/*TODO: remove after september 2023*/}
        <div className={Cls.spacer} />
        <div className={'m-3 alert alert-info'}>
          <div>
            {t('Are_you_looking_for_project_management')} <FaIcon icon={IconDefs.faArrowDown} />
          </div>
          <div className={'d-flex justify-content-end'}>
            <button onClick={handleShowProjectManagement} className={'btn btn-sm btn-primary'}>
              {t('Project_management')}
            </button>
          </div>
        </div>
      </SideMenu>

      {/* Main map */}
      <MainMap />

      {/* Draw menu */}
      <SideMenu
        title={t('Draw_menu')}
        buttonIcon={IconDefs.faDraftingCompass}
        buttonStyle={{ top: '50vh', right: '2vw' }}
        menuPlacement={'right'}
        menuId={'views/MapView-draw'}
        initiallyOpened={isDesktopDevice()}
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
