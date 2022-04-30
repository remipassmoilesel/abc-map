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

import React from 'react';
import { Module, ModuleId } from '@abc-map/module-api';
import ProportionalSymbolsUi from './ui/ProportionalSymbolsUi';
import { newParameters, Parameters } from './Parameters';
import { LayerFactory } from '../../core/geo/layers/LayerFactory';
import { Services } from '../../core/Services';
import { getCenter } from 'ol/extent';
import { FeatureWrapper } from '../../core/geo/features/FeatureWrapper';
import { Point } from 'ol/geom';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import { Logger } from '@abc-map/shared';
import { ScaleAlgorithm } from '../_common/algorithm/Algorithm';
import { Stats } from '../_common/stats/Stats';
import { asNumberOrString, isValidNumber } from '../../core/utils/numbers';
import { ProcessingResult } from './ProcessingResult';
import { Status } from '../color-gradients/ProcessingResult';
import { prettyStringify } from '../../core/utils/strings';
import { AddLayersChangeset } from '../../core/history/changesets/layers/AddLayersChangeset';
import { HistoryKey } from '../../core/history/HistoryKey';
import { LocalModuleId } from '../LocalModuleId';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('DataProcessingModules:ProportionalSymbols.');

export const logger = Logger.get('ProportionalSymbols.tsx');

export class ProportionalSymbols implements Module {
  private params = newParameters();

  constructor(private services: Services) {}

  public getId(): ModuleId {
    return LocalModuleId.ProportionalSymbols;
  }

  public getReadableName(): string {
    return t('Proportional_symbols');
  }

  public getUserInterface() {
    return <ProportionalSymbolsUi initialValue={this.params} onChange={this.handleParamsChange} onProcess={() => this.process(this.params)} />;
  }

  public async process(params: Parameters): Promise<ProcessingResult> {
    logger.info('Using parameters: ', params);

    const { history } = this.services;
    const { newLayerName } = params;
    const { valueField, source, joinBy: dataJoinBy } = params.data;
    const { layer: geometryLayer, joinBy: geometryJoinBy } = params.geometries;
    const { sizeMin, sizeMax, algorithm, type, color } = params.symbols;

    const result: ProcessingResult = {
      status: Status.Succeed,
      featuresProcessed: 0,
      invalidFeatures: 0,
      missingDataRows: [],
      invalidValues: [],
    };

    if (!newLayerName || !source || !valueField || !sizeMin || !sizeMax || !dataJoinBy || !geometryLayer || !geometryJoinBy || !algorithm) {
      return Promise.reject(new Error('Invalid parameters'));
    }

    // We sort data source items to extract min and max values
    const rows = await source.getRows();
    const sortedValues = rows
      .map((r) => asNumberOrString(r[valueField] ?? NaN))
      .filter((v) => isValidNumber(v))
      .sort((a, b) => (a as number) - (b as number)) as number[];

    if (!sortedValues.length || rows.length !== sortedValues.length) {
      const invalidValues = rows
        .map((row) => asNumberOrString(row[valueField] ?? NaN))
        .filter((value) => !isValidNumber(value))
        .map((value) => `${valueField}: ${prettyStringify(value)}`);
      return { ...result, status: Status.InvalidValues, invalidValues };
    }

    const valueMin = sortedValues[0];
    const valueMax = sortedValues[sortedValues.length - 1];
    if (valueMin >= valueMax) {
      const invalidValues = [`Minimum: ${String(valueMin)}`, `Maximum: ${String(valueMax)}`];
      return { ...result, status: Status.InvalidMinMax, invalidValues };
    }

    // Then, for each geometry we create a proportional symbol
    const sourceFeatures = geometryLayer.getSource().getFeatures();
    const newFeatures = sourceFeatures
      .map((feat) => {
        const geom = feat.getGeometry();
        const joinKey: string | number | undefined = feat.get(geometryJoinBy);
        if (!geom || typeof joinKey === 'undefined') {
          logger.error(`Invalid feature, no geometry or join value found. geometryJoinBy=${geometryJoinBy} key=${joinKey}`, feat);
          result.invalidFeatures++;
          return null;
        }

        const row = rows.find((r) => r[dataJoinBy] === joinKey);
        if (!row) {
          logger.error(`Row does not exist for join key ${joinKey}`);
          result.missingDataRows.push(prettyStringify(joinKey));
          return null;
        }

        const value = asNumberOrString(row[valueField] ?? NaN);
        if (!isValidNumber(value) || value <= 0) {
          // Invalid values should have been inspected at sort()
          logger.error(`Invalid size value: ${value}`);
          return null;
        }

        const position = getCenter(geom.getExtent());
        const size = this.pointSize(algorithm, value, valueMin, valueMax, sizeMin, sizeMax);

        const newFeat = FeatureWrapper.create(new Point(position));
        const style = newFeat.getStyleProperties();
        newFeat.setStyleProperties({
          ...style,
          point: {
            ...style.point,
            size,
            icon: type,
            color,
          },
        });

        newFeat.unwrap().setProperties({
          [dataJoinBy]: row[dataJoinBy],
          'point-value': value,
        });

        result.featuresProcessed++;
        return newFeat;
      })
      .filter((f) => !!f)
      .map((f) => f?.unwrap()) as Feature<Geometry>[];

    // Then we create new layer
    const newLayer = LayerFactory.newVectorLayer();
    newLayer.setName(newLayerName);
    newLayer.getSource().addFeatures(newFeatures);

    // We add that layer
    const addLayer = AddLayersChangeset.create([newLayer]);
    await addLayer.apply();
    history.register(HistoryKey.Map, addLayer);

    if (result.missingDataRows.length || result.invalidValues.length || result.invalidFeatures) {
      result.status = Status.BadProcessing;
    }

    return result;
  }

  private pointSize(algorithm: ScaleAlgorithm, value: number, valueMin: number, valueMax: number, sizeMin: number, sizeMax: number): number {
    let size: number;

    if (valueMin === 0) {
      valueMin = 1;
    }

    if (ScaleAlgorithm.Absolute === algorithm) {
      size = Stats.proportionality(value, sizeMin, valueMin, sizeMax);
    } else if (ScaleAlgorithm.Interpolated === algorithm) {
      size = Stats.interpolated(value, valueMin, sizeMin, valueMax, sizeMax);
    } else {
      throw new Error(`Unhandled algorithm: ${algorithm}`);
    }

    return size;
  }

  private handleParamsChange = (params: Parameters) => {
    this.params = params;
  };
}
