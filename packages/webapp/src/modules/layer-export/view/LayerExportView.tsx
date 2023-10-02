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

import Cls from './LayerExportView.module.scss';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { BundledModuleId, Logger } from '@abc-map/shared';
import { LayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { useTranslation } from 'react-i18next';
import { ModuleTitle } from '../../../components/module-title/ModuleTitle';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useMapLayers } from '../../../core/geo/useMapLayers';
import { useServices } from '../../../core/useServices';
import { Routes } from '../../../routes';
import { LayerSelector } from '../../../components/layer-selector/LayerSelector';
import { Format } from './Format';
import { exportLayer } from './exportLayer';
import { FileIO } from '../../../core/utils/FileIO';

const logger = Logger.get('LayerExportView.tsx');

export function LayerExportView() {
  const { t } = useTranslation('LayerExportModule');
  const { toasts } = useServices();

  const { map, layers, activeLayer } = useMapLayers();
  const navigate = useNavigate();

  // Active Layer id is in search params
  const [searchParams] = useSearchParams();
  const searchParamKey = 'layerId';
  const layerId = searchParams.get(searchParamKey) || activeLayer?.getId();
  const layer = layers.find((lay) => lay.getId() === layerId);

  const [format, setFormat] = useState(Format.GeoJSON);
  const handleFormatSelected = useCallback((ev: ChangeEvent<HTMLSelectElement>) => setFormat(ev.target.value as Format), []);

  // User selects a layer in selector
  const handleLayerSelected = useCallback(
    (layer: LayerWrapper | undefined) => {
      const layerId = layer?.getId();
      navigate({
        pathname: Routes.module().withParams({ moduleId: BundledModuleId.LayerExport }),
        search: layerId ? createSearchParams({ layerId }).toString() : undefined,
      });
    },
    [navigate]
  );

  // User clicks on export button
  const handleExport = useCallback(() => {
    if (!layer || !layer.isVector()) {
      toasts.error(t('You_must_select_a_layer_with_data'));
      return;
    }

    const projection = layer.getProjection() || map.getProjection();
    exportLayer(layer, projection, format)
      .then((files) => Promise.all(files.map((file) => FileIO.downloadBlob(file.content, file.path))))
      .catch((err) => {
        toasts.genericError(err);
        logger.error('Export error: ', err);
      });
  }, [format, layer, map, t, toasts]);

  const exportDisabled = !layer || !layer?.isVector();
  const featureNumber = layer?.isVector() && layer?.getSource().getFeatures().length;

  return (
    <div className={Cls.container}>
      <ModuleTitle className={'my-3'}>{t('Layer_export')}</ModuleTitle>

      <div className={'mb-2'}>{t('Which_layer_do_you_want_to_export')}</div>
      <LayerSelector value={layer} onSelected={handleLayerSelected} className={'mb-2'} />

      {layer && !layer?.isVector() && <div className={'alert alert-warning'}>{t('This_layer_cannot_be_exported')}</div>}

      {layer && typeof featureNumber === 'number' && featureNumber > 0 && (
        <div className={'alert alert-info'}>
          {featureNumber} {t('Features_will_be_exported')}
        </div>
      )}

      {layer && typeof featureNumber === 'number' && featureNumber < 1 && (
        <div className={'alert alert-info'}>{t('There_is_nothing_to_export_in_this_layer')}</div>
      )}

      <div className={'mt-3 mb-2'}>{t('Which_format')}</div>
      <select value={format} onChange={handleFormatSelected} className={'form-select mb-2'}>
        <option value={Format.GeoJSON}>{t('GeoJSON')}</option>
        <option value={Format.KML}>{t('KML')}</option>
        <option value={Format.GPX}>{t('GPX')}</option>
        <option value={Format.WKT}>{t('WKT')}</option>
      </select>

      <div className={'d-flex justify-content-end'}>
        <button onClick={handleExport} className={'btn btn-primary'} disabled={exportDisabled}>
          {t('Export')}
        </button>
      </div>
    </div>
  );
}
