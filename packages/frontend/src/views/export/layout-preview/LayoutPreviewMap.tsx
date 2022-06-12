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

import Cls from './LayoutPreviewMap.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { AbcNorth, AbcScale, AbcTextFrame, AbcView, getAbcWindow, Logger } from '@abc-map/shared';
import { AbcLayout } from '@abc-map/shared';
import isEqual from 'lodash/isEqual';
import { LayoutHelper } from '../../../core/project/LayoutHelper';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { E2eMapWrapper } from '../../../core/geo/map/E2eMapWrapper';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';
import { StaticAttributions } from '../../../components/static-attributions/StaticAttributions';
import { MapUi } from '../../../components/map-ui/MapUi';
import { DimensionsPx } from '../../../core/utils/DimensionsPx';
import { useServices } from '../../../core/useServices';
import { Views } from '../../../core/geo/Views';
import { FloatingTextFrame } from '../../../components/text-frame/FloatingTextFrame';
import { FloatingScale } from '../../../components/floating-scale/FloatingScale';
import { LayoutRenderer } from '../../../core/project/rendering/LayoutRenderer';
import { normalize, toPrecision } from '../../../core/utils/numbers';
import { FloatingNorthArrow } from '../../../components/floating-north-arrow/FloatingNorthArrow';

const logger = Logger.get('LayoutPreview.tsx');

interface Props {
  layout?: AbcLayout;
  mainMap: MapWrapper;
  onLayoutChanged: (lay: AbcLayout) => void;
  onNewLayout: () => void;
  onTextFrameChange: (before: AbcTextFrame, after: AbcTextFrame) => void;
  onDeleteTextFrame: (frame: AbcTextFrame) => void;
  onScaleChange: (scale: AbcScale) => void;
  onNorthChange: (north: AbcNorth) => void;
}

const t = prefixedTranslation('ExportView:');

const render = new LayoutRenderer();

function LayoutPreviewMap(props: Props) {
  const { layout, onNewLayout, onLayoutChanged, onTextFrameChange, onDeleteTextFrame, onScaleChange, onNorthChange } = props;
  const { geo } = useServices();
  const [previewView, setPreviewView] = useState<AbcView | undefined>();
  const [previewMap, setPreviewMap] = useState<MapWrapper | undefined>();
  const [previewDimensions, setPreviewDimensions] = useState<DimensionsPx | undefined>();
  const [previewFrames, setPreviewFrames] = useState<AbcTextFrame[]>([]);
  const [previewScale, setPreviewScale] = useState<AbcScale | undefined>(undefined);
  const [previewNorth, setPreviewNorth] = useState<AbcNorth | undefined>(undefined);

  // Ratio used for dimensions, between layout and preview map
  const [previewRatio, setPreviewRatio] = useState<number | undefined>(undefined);

  // Preview map setup
  // We must instantiate a new map each time layout or layout format change
  useEffect(() => {
    // If no layout set, we cannot set up layers
    if (!layout?.format) {
      logger.debug('Cannot setup layers, no layout set');
      return;
    }

    // We instantiate a new map if necessary
    const map = MapFactory.createLayoutPreview();
    getAbcWindow().abc.layoutPreview = new E2eMapWrapper(map);
    setPreviewMap(map);

    // We compute preview map dimensions
    const { width, height } = render.getPreviewDimensionsFor(layout.format);
    setPreviewDimensions({ width, height });

    // We clone layers
    const mainMap = geo.getMainMap();
    map.importLayersFrom(mainMap, { withSelection: false });

    return () => map.dispose();
  }, [geo, layout?.format]);

  // We update preview ratio
  useEffect(() => {
    if (!previewMap || !previewMap.getTarget() || !layout?.view || !previewDimensions) {
      setPreviewRatio(undefined);
      return;
    }

    const dimensionPx = LayoutHelper.formatToPixel(layout.format);
    const ratio = previewMap.getRatioWith(dimensionPx.width, dimensionPx.height);
    setPreviewRatio(ratio);
  }, [layout?.format, layout?.view, previewDimensions, previewMap]);

  // Adapt layout view to preview
  useEffect(() => {
    if (!previewRatio || !layout) {
      return;
    }

    const resolution = toPrecision(layout.view.resolution * previewRatio, 9);
    const updatedView = { ...layout.view, resolution };

    if (!isEqual(previewView, updatedView)) {
      setPreviewView(updatedView);
    }
  }, [layout, layout?.format, layout?.view, previewDimensions, previewMap, previewRatio, previewView]);

  // Triggered when user moves map
  const handleViewChange = useCallback(
    (view: AbcView) => {
      if (!previewRatio || !layout) {
        return;
      }

      const updated: AbcLayout = {
        ...layout,
        view: Views.normalize({ ...view, resolution: view.resolution / previewRatio }),
      };

      if (!isEqual(layout.view, updated.view)) {
        onLayoutChanged(updated);
      }
    },
    [layout, onLayoutChanged, previewRatio]
  );

  // Triggered when user change a text frame
  const handleTextFrameChanged = useCallback(
    (before: AbcTextFrame, after: AbcTextFrame) => {
      if (!previewRatio || !layout?.format) {
        return;
      }

      const { width, height } = LayoutHelper.formatToPixel(layout.format);

      onTextFrameChange(
        {
          ...before,
          position: {
            x: normalize(before.position.x * previewRatio, 0, width),
            y: normalize(before.position.y * previewRatio, 0, height),
          },
          size: {
            width: normalize(before.size.width * previewRatio, 0, width),
            height: normalize(before.size.height * previewRatio, 0, height),
          },
        },
        {
          ...after,
          position: {
            x: normalize(after.position.x * previewRatio, 0, width),
            y: normalize(after.position.y * previewRatio, 0, height),
          },
          size: {
            width: normalize(after.size.width * previewRatio, 0, width),
            height: normalize(after.size.height * previewRatio, 0, height),
          },
        }
      );
    },
    [layout?.format, onTextFrameChange, previewRatio]
  );

  // Adapt text frame positions and sizes to preview
  useEffect(() => {
    if (!layout || !previewRatio || !previewDimensions) {
      setPreviewFrames([]);
      return;
    }

    const { width, height } = previewDimensions;

    const frames: AbcTextFrame[] = layout.textFrames.map((frame) => ({
      ...frame,
      position: {
        x: normalize(frame.position.x / previewRatio, 0, width),
        y: normalize(frame.position.y / previewRatio, 0, height),
      },
      size: {
        width: normalize(frame.size.width / previewRatio, 0, width),
        height: normalize(frame.size.height / previewRatio, 0, height),
      },
    }));

    setPreviewFrames(frames);
  }, [layout, previewDimensions, previewMap, previewRatio]);

  // Triggered when user modify scale position
  const handleScaleChange = useCallback(
    (scale: AbcScale) => {
      if (!previewRatio || !layout?.format) {
        return;
      }

      const { width, height } = LayoutHelper.formatToPixel(layout.format);

      onScaleChange({
        ...scale,
        x: normalize(scale.x * previewRatio, 0, width),
        y: normalize(scale.y * previewRatio, 0, height),
      });
    },
    [layout?.format, onScaleChange, previewRatio]
  );

  // Adapt scale position to preview
  useEffect(() => {
    if (!layout?.scale || !previewRatio || !previewDimensions) {
      setPreviewScale(undefined);
      return;
    }

    const { width, height } = previewDimensions;

    const previewScale: AbcScale = {
      ...layout.scale,
      x: normalize(layout.scale.x / previewRatio, 0, width),
      y: normalize(layout.scale.y / previewRatio, 0, height),
    };

    setPreviewScale(previewScale);
  }, [layout?.scale, previewDimensions, previewMap, previewRatio]);

  // Triggered when user modify north position
  const handleNorthChange = useCallback(
    (north: AbcNorth) => {
      if (!previewRatio || !layout?.format) {
        return;
      }

      const { width, height } = LayoutHelper.formatToPixel(layout.format);

      onNorthChange({
        ...north,
        x: normalize(north.x * previewRatio, 0, width),
        y: normalize(north.y * previewRatio, 0, height),
      });
    },
    [layout?.format, onNorthChange, previewRatio]
  );

  // Adapt north position to preview
  useEffect(() => {
    if (!layout?.north || !previewRatio || !previewDimensions) {
      setPreviewNorth(undefined);
      return;
    }

    const { width, height } = previewDimensions;

    const previewNorth: AbcNorth = {
      ...layout.north,
      x: normalize(layout.north.x / previewRatio, 0, width),
      y: normalize(layout.north.y / previewRatio, 0, height),
    };

    setPreviewNorth(previewNorth);
  }, [layout?.north, previewDimensions, previewMap, previewRatio]);

  return (
    <div className={Cls.layoutPreview} data-cy={'layout-preview'}>
      {/* There is one layout to preview, we display it */}
      {previewMap && previewDimensions && layout && (
        <div className={Cls.previewContainer}>
          {/* Map */}
          <MapUi
            map={previewMap}
            view={previewView}
            onViewMove={handleViewChange}
            width={previewDimensions.width + 'px'}
            height={previewDimensions.height + 'px'}
            data-cy={'layout-preview-map'}
          />

          {/* Text frames */}
          {previewFrames.map((f) => (
            <FloatingTextFrame key={f.id} frame={f} onChange={handleTextFrameChanged} onDelete={onDeleteTextFrame} bounds={'parent'} />
          ))}

          {/* Scale */}
          {previewScale && <FloatingScale map={previewMap} scale={previewScale} baseFontSizeEm={0.9} minWidth={50} onChange={handleScaleChange} />}

          {/* North */}
          {previewNorth && <FloatingNorthArrow map={previewMap} north={previewNorth} onChange={handleNorthChange} />}

          {/* Attributions */}
          <StaticAttributions map={previewMap} />
        </div>
      )}

      {/* There is no layout to preview, we display a message with "create" a button */}
      {!layout && (
        <div className={Cls.noLayout}>
          <FaIcon icon={IconDefs.faPrint} size={'5rem'} className={'mb-4'} />
          <h3 className={'mb-4'}>{t('Export')}</h3>
          <div className={'mb-3'}>{t('Create_layout_to_export')}</div>

          <button onClick={onNewLayout} className={'btn btn-primary mt-3'} data-cy={'new-layout'}>
            <FaIcon icon={IconDefs.faPlus} className={'mr-2'} />
            {t('Create_A4_layout')}
          </button>
        </div>
      )}
    </div>
  );
}

export default withTranslation()(LayoutPreviewMap);
