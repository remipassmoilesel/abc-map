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
import React, { useCallback, useEffect, useState } from 'react';
import { pageSetup } from '../../core/utils/page-setup';
import { Link, useRouteMatch } from 'react-router-dom';
import { AbcScale, AbcTextFrame, AbcView, getAbcWindow, Logger, ProjectConstants, SharedMapParams } from '@abc-map/shared';
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
import { FloatingTextFrame } from '../../components/text-frame/FloatingTextFrame';
import { FloatingScale } from '../../components/floating-scale/FloatingScale';
import { toPrecision } from '../../core/utils/numbers';
import { useAppSelector } from '../../core/store/hooks';
import { DimensionsStyle } from '../../core/utils/DimensionsStyle';
import { adaptMapDimensions } from '../../core/project/adaptMapDimensions';
import SharedViewNavigation from '../../components/shared-view-navigation/SharedViewNavigation';
import { adaptView } from './adaptView';
import { ProjectStatus } from '../../core/project/ProjectStatus';
import { FileIO } from '../../core/utils/FileIO';
import DownloadExplanation from './download-explanation/DownloadExplanation';
import { SharedMapKeyboardListener } from './SharedMapKeyboardListener';
import { InteractiveAttributions } from '../../components/interactive-attributions/InteractiveAttributions';

export const logger = Logger.get('SharedMapView.tsx');

const t = prefixedTranslation('SharedMapView:');

/**
 * This is the only view of Abc-Map that can be displayed in an iframe.
 *
 * All the links to the main application should target another tab / window, for security purposes.
 *
 * /!\ This view is (almost) responsive, but statically.
 *
 */
function SharedMapView() {
  const { project, geo, toasts } = useServices();
  const match = useRouteMatch<SharedMapParams>();
  // Here we use a state for map because we have to re-render after map init
  const [map, setMap] = useState<MapWrapper | undefined>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menu, showMenu] = useState(false);
  const [previewFrames, setPreviewFrames] = useState<AbcTextFrame[]>([]);
  const [previewScale, setPreviewScale] = useState<AbcScale | undefined>(undefined);
  const { fullscreen, mapDimensions } = useAppSelector((st) => st.project.sharedViews);
  const [mapDimensionsStyle, setMapDimensionsStyle] = useState<DimensionsStyle | undefined>();
  const [previewView, setPreviewView] = useState<AbcView | undefined>();
  const [downloadExplanation, showDownloadExplanation] = useState(false);
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

  // Setup keyboard shortcuts
  useEffect(() => {
    const listener = SharedMapKeyboardListener.create();
    listener.initialize();

    return () => listener.destroy();
  }, []);

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
    resolveInAtLeast(project.loadPublicProject(projectId), 1000)
      .then(() => map.importLayersFrom(geo.getMainMap(), { withSelection: false }))
      .catch((err) => {
        logger.error('Loading error: ', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [geo, map, match.params.projectId, project]);

  // Set map size
  useEffect(() => {
    const { width, height } = adaptMapDimensions(fullscreen, mapDimensions);
    setMapDimensionsStyle({ width: `${width}px`, height: `${height}px` });
  }, [fullscreen, mapDimensions]);

  // Update map layers when active view change
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

  // Update map view when active view change
  useEffect(() => {
    if (!activeView?.view) {
      setPreviewView(undefined);
      return;
    }

    const view = adaptView(activeView.view, fullscreen, mapDimensions);
    setPreviewView(view);
  }, [activeView?.view, fullscreen, mapDimensions]);

  const handleRestoreView = useCallback(() => {
    if (!activeView?.view) {
      return;
    }

    const view = adaptView(activeView.view, fullscreen, mapDimensions);
    setPreviewView(view);
  }, [activeView?.view, fullscreen, mapDimensions]);

  // Adapt relative values of frames
  useEffect(() => {
    if (!activeView?.textFrames) {
      setPreviewFrames([]);
      return;
    }

    const { width, height } = adaptMapDimensions(fullscreen, mapDimensions);

    const previewFrames = activeView.textFrames.map((frame) => ({
      ...frame,
      position: {
        x: toPrecision((frame.position.x * width) / 100, 2),
        y: toPrecision((frame.position.y * height) / 100, 2),
      },
      size: {
        width: toPrecision((frame.size.width * width) / 100, 2),
        height: toPrecision((frame.size.height * height) / 100, 2),
      },
    }));

    setPreviewFrames(previewFrames);
  }, [activeView?.textFrames, fullscreen, mapDimensions]);

  // Adapt relative values of scale
  useEffect(() => {
    if (!activeView?.scale) {
      setPreviewScale(undefined);
      return;
    }

    const { width, height } = adaptMapDimensions(fullscreen, mapDimensions);

    const previewScale = {
      ...activeView.scale,
      x: toPrecision((activeView.scale.x * width) / 100, 2),
      y: toPrecision((activeView.scale.y * height) / 100, 2),
    };

    setPreviewScale(previewScale);
  }, [activeView?.scale, fullscreen, mapDimensions]);

  const handleToggleMenu = useCallback(() => showMenu(!menu), [menu]);

  const handleDownload = useCallback(() => {
    const toastId = toasts.info(t('Downloading'));
    resolveInAtLeast(project.cloneCurrent(), 800)
      .then((exported) => {
        if (exported === ProjectStatus.Canceled) {
          return;
        }

        showDownloadExplanation(true);
        FileIO.outputBlob(exported.project, `project${ProjectConstants.FileExtension}`);
      })
      .catch((err) => {
        toasts.genericError(err);
        logger.error('Clone error: ', err);
      })
      .finally(() => toasts.dismiss(toastId));
  }, [project, toasts]);

  return (
    <div className={Cls.sharedMap}>
      {!loading && !error && (
        <>
          {activeView && map && (
            <div className={Cls.mapContainer} style={mapDimensionsStyle}>
              <MapUi map={map} view={previewView} width={'100%'} height={'100%'} data-testid={'shared-map'} className={Cls.map} data-cy={'shared-map'} />

              {previewFrames.map((frame) => (
                <FloatingTextFrame key={frame.id} frame={frame} bounds={'parent'} readOnly={true} />
              ))}

              {previewScale && <FloatingScale map={map} scale={previewScale} readOnly={true} />}

              {/* Navigation controls */}
              {!menu && <SharedViewNavigation onMore={handleToggleMenu} className={Cls.navigationButton} />}
              {menu && <NavigationMenu onDownload={handleDownload} onClose={handleToggleMenu} onRestoreView={handleRestoreView} />}

              <InteractiveAttributions map={map} className={Cls.attributions} />
            </div>
          )}
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

      {downloadExplanation && <DownloadExplanation onClose={() => showDownloadExplanation(false)} />}
    </div>
  );
}

export default withTranslation()(SharedMapView);
