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

import Cls from './LayoutPreview.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { AbcScale, AbcTextFrame, AbcView, getAbcWindow, Logger } from '@abc-map/shared';
import { AbcLayout } from '@abc-map/shared';
import isEqual from 'lodash/isEqual';
import { LayoutHelper } from '../../../core/project/LayoutHelper';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import { E2eMapWrapper } from '../../../core/geo/map/E2eMapWrapper';
import { toPrecision } from '../../../core/utils/numbers';
import { prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';
import { Attributions } from '../../../components/attributions/Attributions';
import { MapUi } from '../../../components/map-ui/MapUi';
import { DimensionsPx } from '../../../core/utils/DimensionsPx';
import { useServices } from '../../../core/useServices';
import { Views } from '../../../core/geo/Views';
import { FloatingTextFrame } from '../../../components/text-frame/FloatingTextFrame';
import { FloatingScale } from '../../../components/floating-scale/FloatingScale';
import { LayoutRenderer } from '../../../core/project/rendering/LayoutRenderer';

const logger = Logger.get('LayoutPreview.tsx');

interface Props {
  layout?: AbcLayout;
  mainMap: MapWrapper;
  onLayoutChanged: (lay: AbcLayout) => void;
  onNewLayout: () => void;
  onTextFrameChange: (before: AbcTextFrame, after: AbcTextFrame) => void;
  onDeleteTextFrame: (frame: AbcTextFrame) => void;
  onScaleChange: (scale: AbcScale) => void;
}

const t = prefixedTranslation('ExportView:');

const render = new LayoutRenderer();

function LayoutPreview(props: Props) {
  const { layout, onNewLayout, onLayoutChanged, onTextFrameChange, onDeleteTextFrame, onScaleChange } = props;
  const { geo } = useServices();
  const [previewView, setPreviewView] = useState<AbcView | undefined>();
  const [previewMap, setPreviewMap] = useState<MapWrapper | undefined>();
  const [previewDimensions, setPreviewDimensions] = useState<DimensionsPx | undefined>();
  const [previewFrames, setPreviewFrames] = useState<AbcTextFrame[]>([]);
  const [previewScale, setPreviewScale] = useState<AbcScale | undefined>(undefined);

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

  // Preview view setup
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
      if (!previewRatio) {
        return;
      }

      onTextFrameChange(
        {
          ...before,
          position: {
            x: toPrecision(before.position.x * previewRatio, 9),
            y: toPrecision(before.position.y * previewRatio, 9),
          },
          size: {
            width: toPrecision(before.size.width * previewRatio, 9),
            height: toPrecision(before.size.height * previewRatio, 9),
          },
        },
        {
          ...after,
          position: {
            x: toPrecision(after.position.x * previewRatio, 9),
            y: toPrecision(after.position.y * previewRatio, 9),
          },
          size: {
            width: toPrecision(after.size.width * previewRatio, 9),
            height: toPrecision(after.size.height * previewRatio, 9),
          },
        }
      );
    },
    [onTextFrameChange, previewRatio]
  );

  // Update text frame positions and sizes to match preview
  useEffect(() => {
    if (!layout || !previewRatio) {
      setPreviewFrames([]);
      return;
    }

    const frames: AbcTextFrame[] = (layout?.textFrames || []).map((frame) => ({
      ...frame,
      position: {
        x: toPrecision(frame.position.x / previewRatio, 9),
        y: toPrecision(frame.position.y / previewRatio, 9),
      },
      size: {
        width: toPrecision(frame.size.width / previewRatio, 9),
        height: toPrecision(frame.size.height / previewRatio, 9),
      },
    }));

    setPreviewFrames(frames);
  }, [layout, layout?.textFrames, previewMap, previewRatio]);

  const handleScaleChange = useCallback(
    (scale: AbcScale) => {
      if (!previewRatio) {
        return;
      }

      onScaleChange({
        ...scale,
        x: toPrecision(scale.x * previewRatio, 9),
        y: toPrecision(scale.y * previewRatio, 9),
      });
    },
    [onScaleChange, previewRatio]
  );

  // Update scale position to match preview
  useEffect(() => {
    if (!layout?.scale || !previewRatio) {
      setPreviewScale(undefined);
      return;
    }

    const previewScale: AbcScale = {
      ...layout.scale,
      x: toPrecision(layout.scale.x / previewRatio, 9),
      y: toPrecision(layout.scale.y / previewRatio, 9),
    };

    setPreviewScale(previewScale);
  }, [layout, layout?.textFrames, previewMap, previewRatio]);

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
            className={Cls.previewMap}
            data-cy={'layout-preview-map'}
          />

          {/* Text frames */}
          {previewFrames.map((f) => (
            <FloatingTextFrame key={f.id} frame={f} editable={true} onChange={handleTextFrameChanged} onDelete={onDeleteTextFrame} bounds={'parent'} />
          ))}

          {/* Scale */}
          {previewScale && <FloatingScale map={previewMap} scale={previewScale} baseFontSizeVmin={0.9} minWidth={50} onChange={handleScaleChange} />}

          {/* Attributions */}
          <Attributions map={previewMap} />
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

export default withTranslation()(LayoutPreview);
