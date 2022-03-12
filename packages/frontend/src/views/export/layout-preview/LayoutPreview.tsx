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
import { AbcView, getAbcWindow, LayoutFormat, Logger } from '@abc-map/shared';
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
import { MapLegend } from '../../../components/map-legend/MapLegend';
import { MapUi } from '../../../components/map-ui/MapUi';
import { DimensionsPx } from '../../../core/utils/DimensionsPx';
import { useServices } from '../../../core/useServices';
import { Views } from '../../../core/geo/Views';

const logger = Logger.get('LayoutPreview.tsx');

const t = prefixedTranslation('ExportView:');

interface Props {
  layout?: AbcLayout;
  mainMap: MapWrapper;
  onLayoutChanged: (lay: AbcLayout) => void;
  onNewLayout: () => void;
}

function LayoutPreview(props: Props) {
  const { layout, onNewLayout, onLayoutChanged } = props;
  const { geo } = useServices();
  const [previewView, setPreviewView] = useState<AbcView | undefined>();
  const [previewMap, setPreviewMap] = useState<MapWrapper | undefined>();
  const [previewRatio, setPreviewRatio] = useState(1);
  const [previewDimensions, setPreviewDimensions] = useState<DimensionsPx | undefined>();

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
    const { width, height } = getPreviewDimensionsFor(layout.format);
    setPreviewDimensions({ width, height });

    // We clone layers with adapted style ratio
    const previewRatio = geo.getMainMap().getMainRatio(width, height);
    setPreviewRatio(previewRatio);

    const mainMap = geo.getMainMap();
    map.importLayersFrom(mainMap, { ratio: previewRatio, withSelection: false });

    return () => map.dispose();
  }, [geo, layout?.format]);

  // Preview view setup
  useEffect(() => {
    if (!previewMap || !previewMap.getTarget() || !layout?.view || !previewDimensions) {
      logger.debug('Cannot update preview map view, not ready', { previewMap, view: layout?.view, previewDimensions });
      return;
    }

    const dimensionPx = LayoutHelper.formatToPixel(layout.format);
    const ratio = previewMap.getRatioWith(dimensionPx.width, dimensionPx.height);
    const resolution = toPrecision(layout.view.resolution * ratio, 9);
    const updatedView = { ...layout.view, resolution };

    if (!isEqual(previewView, updatedView)) {
      setPreviewView(updatedView);
    }
  }, [layout?.format, layout?.view, previewDimensions, previewMap, previewView]);

  // Triggered when user moves map
  const handleViewChange = useCallback(
    (view: AbcView) => {
      if (!previewMap || !previewMap.getTarget() || !layout || !previewDimensions) {
        logger.debug('Cannot handle view changes, not ready', { previewMap, layout, previewDimensions });
        return;
      }

      const dimensionPx = LayoutHelper.formatToPixel(layout.format);
      const ratio = previewMap.getRatioWith(dimensionPx.width, dimensionPx.height);

      const updated: AbcLayout = {
        ...layout,
        view: Views.normalize({
          ...view,
          resolution: view.resolution / ratio,
        }),
      };

      if (!isEqual(layout.view, updated.view)) {
        onLayoutChanged(updated);
      }
    },
    [layout, onLayoutChanged, previewDimensions, previewMap]
  );

  return (
    <div className={Cls.layoutPreview} data-cy={'layout-preview'}>
      {/* There is one layout to preview, we display it */}
      {previewMap && previewDimensions && layout && (
        <div className={Cls.previewContainer}>
          <MapUi
            map={previewMap}
            view={previewView}
            onViewMove={handleViewChange}
            width={previewDimensions.width + 'px'}
            height={previewDimensions.height + 'px'}
            className={Cls.previewMap}
            data-cy={'layout-preview-map'}
          />
          <MapLegend legend={layout.legend} map={previewMap} ratio={previewRatio} />
          <Attributions legendDisplay={layout.legend.display} map={previewMap} ratio={previewRatio} />
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

/**
 * Compute preview map dimensions from layout. The main goal of this function is to create
 * a map that fit both layout and user screen.
 */
function getPreviewDimensionsFor(format: LayoutFormat): DimensionsPx {
  const maxWidth = Math.round(document.body.offsetWidth - document.body.offsetWidth / 5);
  const maxHeight = Math.round(document.body.offsetHeight - document.body.offsetHeight / 5);

  let width = maxWidth;
  let height = Math.round((format.height * width) / format.width);
  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round((format.width * height) / format.height);
  }
  return { width, height };
}

export default withTranslation()(LayoutPreview);
