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

import React, { ChangeEvent, useCallback } from 'react';
import { Logger } from '@abc-map/shared';
import { LayerWrapper, VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import { useTranslation } from 'react-i18next';
import { useMapLayers } from '../../core/geo/useMapLayers';
import clsx from 'clsx';

const logger = Logger.get('LayerSelector.tsx');

interface Props {
  value: LayerWrapper | undefined;
  /**
   * When a value is selected this call back is called.
   *
   * If the selected layer is vector, it will be passed as first and second argument.
   *
   * @param layer
   * @param vectorLayer
   */
  onSelected: (layer: LayerWrapper | undefined, vectorLayer: VectorLayerWrapper | undefined) => void;

  /**
   * If true, only vector layers will be displayed
   */
  onlyVector?: boolean;

  /**
   * If true, a lable will be shown
   */
  label?: string;

  'data-cy'?: string;
  'data-testid'?: string;
  className?: string;
}

const None = 'None';

export function LayerSelector(props: Props) {
  const { t } = useTranslation('VectorLayerSelector');
  const { value, onSelected, onlyVector, 'data-cy': dataCy, 'data-testid': dataTestid, label, className } = props;
  const { layers } = useMapLayers();

  const handleSelection = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const layerId = ev.target.value;

      if (!layerId || layerId === None) {
        onSelected(undefined, undefined);
        return;
      }

      const layer = layers.find((layer) => layer.getId() === layerId);
      if (!layer) {
        logger.error(`Layer not found: "${layerId}"`);
        onSelected(undefined, undefined);
        return;
      }

      onSelected(layer, layer.isVector() ? layer : undefined);
    },
    [layers, onSelected]
  );

  const toDisplay = onlyVector ? layers.filter((layer) => layer.isVector()) : layers;

  return (
    <div className={clsx(className)}>
      {label && <div className={'flex-grow-1'}>{label}</div>}
      <select onChange={handleSelection} value={value?.getId()} className={'form-select'} data-cy={dataCy} data-testid={dataTestid}>
        <option value={None}>{t('Select_a_layer')}</option>
        {toDisplay.map((lay) => (
          <option key={lay.getId()} value={lay.getId()}>
            {lay.getName()}
          </option>
        ))}
      </select>
    </div>
  );
}
