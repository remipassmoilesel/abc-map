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
import ColorGradientsUi from './ui/ColorGradientsUi';
import { newParameters, Parameters } from './Parameters';
import { Logger } from '@abc-map/shared';
import { FeatureWrapper } from '../../core/geo/features/FeatureWrapper';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { LayerFactory } from '../../core/geo/layers/LayerFactory';
import { GradientAlgorithm, ScaleAlgorithm } from '../_common/algorithm/Algorithm';
import { Services } from '../../core/Services';
import { GradientClass } from './GradientClass';
import * as chroma from 'chroma-js';
import { asNumberOrString, isValidNumber, toPrecision } from '../../core/utils/numbers';
import { ProcessingResult, Status } from './ProcessingResult';
import { prettyStringify } from '../../core/utils/strings';
import { HistoryKey } from '../../core/history/HistoryKey';
import { AddLayersChangeset } from '../../core/history/changesets/layers/AddLayersChangeset';
import { Module, ModuleId } from '@abc-map/module-api';
import { LocalModuleId } from '../LocalModuleId';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('DataProcessingModules:ColorGradients.');

export const logger = Logger.get('ColorGradients.tsx');

export class ColorGradients implements Module {
  private params = newParameters();

  constructor(private services: Services) {}

  public getId(): ModuleId {
    return LocalModuleId.ColorGradients;
  }

  public getReadableName(): string {
    return t('Color_gradients');
  }

  public getUserInterface() {
    return <ColorGradientsUi initialValue={this.params} onChange={this.handleParamsChange} onProcess={() => this.process(this.params)} />;
  }

  public async process(params: Parameters): Promise<ProcessingResult> {
    logger.info('Using parameters: ', params);

    const { history } = this.services;
    const { newLayerName } = params;
    const { valueField, source, joinBy: dataJoinBy } = params.data;
    const { layer: geometryLayer, joinBy: geometryJoinBy } = params.geometries;
    const { start, end, algorithm, classes } = params.colors;

    const result: ProcessingResult = {
      status: Status.Succeed,
      featuresProcessed: 0,
      invalidFeatures: 0,
      missingDataRows: [],
      invalidValues: [],
    };

    if (!newLayerName || !source || !valueField || !start || !end || !dataJoinBy || !geometryLayer || !geometryJoinBy || !algorithm) {
      return Promise.reject(new Error('Invalid parameters'));
    }

    if (algorithm !== ScaleAlgorithm.Interpolated && !classes?.length) {
      return Promise.reject(new Error('Classes are mandatory with ScaleAlgorithm.Interpolated'));
    }

    // We sort data source items to extract min and max values
    const rows = await source.getRows();
    const sortedValues = rows
      .map((row) => asNumberOrString(row[valueField] ?? NaN))
      .filter((value) => isValidNumber(value))
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

    // Then, for each geometry we create a geometry with computed color
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
          logger.error(`Invalid color value: ${value}`);
          return null;
        }

        const color = this.geometryColor(algorithm, value, valueMin, valueMax, start, end, classes || []);

        const newFeat = FeatureWrapper.create(geom.clone()).setId();
        const style = newFeat.getStyleProperties();
        newFeat.setStyleProperties({
          ...style,
          fill: {
            ...style.fill,
            color1: color,
          },
        });

        newFeat.unwrap().setProperties({
          [dataJoinBy]: row[dataJoinBy],
          'gradient-value': value,
        });

        result.featuresProcessed++;
        return newFeat;
      })
      .filter((f) => !!f)
      .map((f) => f?.unwrap()) as Feature<Geometry>[];

    // Then we create a layer
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

  private geometryColor(
    algorithm: GradientAlgorithm,
    value: number,
    valueMin: number,
    valueMax: number,
    startColor: string,
    endColor: string,
    classes: GradientClass[]
  ): string {
    if (ScaleAlgorithm.Interpolated === algorithm) {
      const colorFunc = chroma.scale([startColor, endColor]).domain([valueMin, valueMax]);
      return colorFunc(value).hex();
    } else {
      // We ensure we have a defined precision in order to prevent weird issues with javascript magic
      const normalized = toPrecision(value);
      const targetClass = classes.find((cl) => normalized >= cl.lower && normalized <= cl.upper);
      if (!targetClass) {
        logger.error(`No class found for value ${normalized}`);
        return 'black';
      }
      return targetClass.color;
    }
  }

  private handleParamsChange = (params: Parameters) => {
    this.params = params;
  };
}
