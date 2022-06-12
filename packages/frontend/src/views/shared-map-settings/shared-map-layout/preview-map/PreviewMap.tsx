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

import Cls from './PreviewMap.module.scss';
import { MapUi } from '../../../../components/map-ui/MapUi';
import { FloatingTextFrame } from '../../../../components/text-frame/FloatingTextFrame';
import { FloatingScale } from '../../../../components/floating-scale/FloatingScale';
import { useCallback, useEffect, useState } from 'react';
import { MapWrapper } from '../../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../../core/geo/map/MapFactory';
import { E2eMapWrapper } from '../../../../core/geo/map/E2eMapWrapper';
import { useServices } from '../../../../core/useServices';
import { AbcNorth, AbcScale, AbcTextFrame, AbcView, getAbcWindow, Logger } from '@abc-map/shared';
import { useActiveSharedView } from '../../../../core/project/useActiveSharedView';
import { Views } from '../../../../core/geo/Views';
import { useAppSelector } from '../../../../core/store/hooks';
import { normalize } from '../../../../core/utils/numbers';
import { DimensionsStyle } from '../../../../core/utils/DimensionsStyle';
import { adaptMapDimensions } from '../../../../core/project/adaptMapDimensions';
import SharedViewNavigation from '../../../../components/shared-view-navigation/SharedViewNavigation';
import SharedViewList from '../shared-view-list/SharedViewList';
import { InteractiveAttributions } from '../../../../components/interactive-attributions/InteractiveAttributions';
import { FloatingNorthArrow } from '../../../../components/floating-north-arrow/FloatingNorthArrow';

const logger = Logger.get('PreviewMap.tsx');

interface Props {
  onNewView: () => void;
  onViewMove: (v: AbcView) => void;
  onRemoveTextFrame: (f: AbcTextFrame) => void;
  onTextFrameChange: (before: AbcTextFrame, after: AbcTextFrame) => void;
  onScaleChange: (scale: AbcScale) => void;
  onNorthChange: (scale: AbcNorth) => void;
}

export function PreviewMap(props: Props) {
  const { onNewView, onViewMove, onRemoveTextFrame, onTextFrameChange, onScaleChange, onNorthChange } = props;
  const { geo } = useServices();
  const [map, setMap] = useState<MapWrapper>();
  const [previewFrames, setPreviewFrames] = useState<AbcTextFrame[]>([]);
  const [previewScale, setPreviewScale] = useState<AbcScale | undefined>(undefined);
  const [previewNorth, setPreviewNorth] = useState<AbcNorth | undefined>(undefined);
  const { fullscreen, mapDimensions } = useAppSelector((st) => st.project.sharedViews);
  const [mapDimensionsStyle, setMapDimensionsStyle] = useState<DimensionsStyle | undefined>();
  const activeView = useActiveSharedView();

  // Setup map on mount
  useEffect(() => {
    if (!map) {
      const map = MapFactory.createDefault();
      setMap(map);
      getAbcWindow().abc.sharingLayoutMap = new E2eMapWrapper(map);
    }
  }, [geo, map]);

  // Set map size
  useEffect(() => {
    const { width, height } = adaptMapDimensions(fullscreen, mapDimensions);
    setMapDimensionsStyle({ width: `${width}px`, height: `${height}px` });
  }, [fullscreen, mapDimensions]);

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

  // Update view when user change map position
  const handleViewMove = useCallback(() => {
    if (!map) {
      return;
    }

    const previewView = map.getView();
    onViewMove(
      Views.normalize({
        resolution: previewView.resolution,
        projection: previewView.projection,
        center: previewView.center,
        rotation: previewView.rotation,
      })
    );
  }, [map, onViewMove]);

  // Adapt relative position and size of frames
  useEffect(() => {
    if (!activeView?.textFrames) {
      setPreviewFrames([]);
      return;
    }

    const { width, height } = adaptMapDimensions(fullscreen, mapDimensions);

    const previewFrames = activeView.textFrames.map((frame) => ({
      ...frame,
      position: {
        x: normalize((frame.position.x * width) / 100, 0, width, 2),
        y: normalize((frame.position.y * height) / 100, 0, height, 2),
      },
      size: {
        width: normalize((frame.size.width * width) / 100, 0, width, 2),
        height: normalize((frame.size.height * height) / 100, 0, height, 2),
      },
    }));

    setPreviewFrames(previewFrames);
  }, [activeView?.textFrames, fullscreen, mapDimensions]);

  const handleTextFrameChange = useCallback(
    (before: AbcTextFrame, after: AbcTextFrame) => {
      const { width, height } = adaptMapDimensions(fullscreen, mapDimensions);

      onTextFrameChange(
        {
          ...before,
          position: {
            x: normalize((before.position.x / width) * 100, 0, 100, 2),
            y: normalize((before.position.y / height) * 100, 0, 100, 2),
          },
          size: {
            width: normalize((before.size.width / width) * 100, 0, 100, 2),
            height: normalize((before.size.height / height) * 100, 0, 100, 2),
          },
        },
        {
          ...after,
          position: {
            x: normalize((after.position.x / width) * 100, 0, 100, 2),
            y: normalize((after.position.y / height) * 100, 0, 100, 2),
          },
          size: {
            width: normalize((after.size.width / width) * 100, 0, 100, 2),
            height: normalize((after.size.height / height) * 100, 0, 100, 2),
          },
        }
      );
    },
    [fullscreen, mapDimensions, onTextFrameChange]
  );

  // Adapt relative position of scale
  useEffect(() => {
    if (!activeView?.scale) {
      setPreviewScale(undefined);
      return;
    }

    const { width, height } = adaptMapDimensions(fullscreen, mapDimensions);

    const previewScale: AbcScale = {
      ...activeView.scale,
      x: normalize((activeView.scale.x * width) / 100, 0, width, 2),
      y: normalize((activeView.scale.y * height) / 100, 0, height, 2),
    };

    setPreviewScale(previewScale);
  }, [activeView?.scale, fullscreen, mapDimensions]);

  const handleScaleChange = useCallback(
    (before: AbcScale) => {
      const { width, height } = adaptMapDimensions(fullscreen, mapDimensions);

      onScaleChange({
        ...before,
        x: normalize((before.x / width) * 100, 0, 100, 2),
        y: normalize((before.y / height) * 100, 0, 100, 2),
      });
    },
    [fullscreen, mapDimensions, onScaleChange]
  );

  // Adapt relative position of north
  useEffect(() => {
    if (!activeView?.north) {
      setPreviewNorth(undefined);
      return;
    }

    const { width, height } = adaptMapDimensions(fullscreen, mapDimensions);

    const previewNorth: AbcScale = {
      ...activeView.north,
      x: normalize((activeView.north.x * width) / 100, 0, width, 2),
      y: normalize((activeView.north.y * height) / 100, 0, height, 2),
    };

    setPreviewNorth(previewNorth);
  }, [activeView?.north, fullscreen, mapDimensions]);

  const handleNorthChange = useCallback(
    (before: AbcNorth) => {
      const { width, height } = adaptMapDimensions(fullscreen, mapDimensions);

      onNorthChange({
        ...before,
        x: normalize((before.x / width) * 100, 0, 100, 2),
        y: normalize((before.y / height) * 100, 0, 100, 2),
      });
    },
    [fullscreen, mapDimensions, onNorthChange]
  );

  // List of views
  const [viewList, showViewList] = useState(false);
  const handleToggleList = useCallback(() => showViewList(!viewList), [viewList]);

  return (
    <>
      {/* Preview map */}
      {map && (
        <div className={Cls.mapContainer} style={mapDimensionsStyle}>
          <MapUi map={map} view={activeView?.view} onViewMove={handleViewMove} width={'100%'} height={'100%'} data-cy={'sharing-layout-map'} />

          {previewFrames.map((frame) => (
            <FloatingTextFrame key={frame.id} frame={frame} onChange={handleTextFrameChange} onDelete={onRemoveTextFrame} bounds={'parent'} />
          ))}

          {previewScale && <FloatingScale map={map} scale={previewScale} onChange={handleScaleChange} />}

          {previewNorth && <FloatingNorthArrow map={map} north={previewNorth} onChange={handleNorthChange} />}

          {/* The same menu as in preview */}
          {!viewList && <SharedViewNavigation onMore={handleToggleList} className={Cls.navigation} />}

          {/* List of views, only if open */}
          {viewList && <SharedViewList onNewView={onNewView} onClose={handleToggleList} className={Cls.viewList} />}

          <InteractiveAttributions map={map} className={Cls.attributions} />
        </div>
      )}
    </>
  );
}
