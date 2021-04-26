import React, { ReactNode } from 'react';
import { Module } from '../Module';
import Panel from './ui/ProportionalSymbolsUi';
import { ModuleId } from '../ModuleId';
import { newParameters, Parameters, ScaleAlgorithm } from './Parameters';
import { LayerFactory } from '../../core/geo/layers/LayerFactory';
import { Services } from '../../core/Services';
import { getCenter } from 'ol/extent';
import { FeatureWrapper } from '../../core/geo/features/FeatureWrapper';
import { Point } from 'ol/geom';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import { Logger } from '@abc-map/frontend-commons';

export const logger = Logger.get('ProportionalSymbols.tsx');

export class ProportionalSymbols extends Module {
  private params = newParameters();

  constructor(private services: Services) {
    super();
  }

  public getId(): ModuleId {
    return ModuleId.ProportionalSymbols;
  }

  public getReadableName(): string {
    return 'Symboles proportionnels';
  }

  public getUserInterface(): ReactNode {
    return <Panel initialValue={this.params} onChange={this.handleParamsChange} onProcess={() => this.process(this.params)} />;
  }

  public async process(params: Parameters): Promise<void> {
    logger.info('Using parameters: ', params);

    const { newLayerName, data, geometries, points } = params;
    const { sizeField, source, joinBy: dataJoinBy } = data;
    const { layer: geometryLayer, joinBy: geometryJoinBy } = geometries;
    const { sizeMin, sizeMax, algorithm } = points;

    if (!newLayerName || !source || !sizeField || !sizeMin || !sizeMax || !dataJoinBy || !geometryLayer || !geometryJoinBy || !algorithm) {
      return Promise.reject(new Error('Invalid parameters'));
    }

    // We sort data source items to extract min and max values
    const rows = await source.getRows();
    const sortedValues = rows
      .map((r) => r[sizeField])
      .filter((v) => typeof v === 'number')
      .sort((a, b) => (a as number) - (b as number)) as number[];

    if (!sortedValues.length || rows.length !== sortedValues.length) {
      return Promise.reject(new Error('Invalid datasource'));
    }

    const valueMin = sortedValues[0];
    const valueMax = sortedValues[sortedValues.length - 1];
    if (valueMin >= valueMax) {
      return Promise.reject(new Error('Invalid datasource'));
    }

    // Then, for each geometry we create a proportional symbol
    const sourceFeatures = geometryLayer.getSource().getFeatures();
    const newFeatures = sourceFeatures
      .map((feat) => {
        const geom = feat.getGeometry();
        const joinKey: string | number | undefined = feat.get(geometryJoinBy);
        if (!geom || typeof joinKey === 'undefined') {
          logger.error(`Invalid feature, no geometry or join value found. geometryJoinBy=${geometryJoinBy} key=${joinKey}`, feat);
          return null;
        }

        const row = rows.find((r) => r[dataJoinBy] === joinKey);
        if (!row) {
          logger.error(`Row does not exist for join key ${joinKey}`);
          return null;
        }

        const value = row[sizeField];
        if (typeof value !== 'number') {
          logger.error(`Invalid size value: ${value}`);
          return null;
        }

        if (value < 1) {
          logger.warn('Some values are smaller than one, skipping');
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
          },
        });

        newFeat.unwrap().setProperties({
          [dataJoinBy]: row[dataJoinBy],
          'point-value': value,
        });

        return newFeat;
      })
      .filter((f) => !!f)
      .map((f) => f?.unwrap()) as Feature<Geometry>[];

    // Then we create and add a new layer with symbols
    const newLayer = LayerFactory.newVectorLayer();
    newLayer.setName(newLayerName);
    newLayer.getSource().addFeatures(newFeatures);

    const map = this.services.geo.getMainMap();
    map.addLayer(newLayer);
    map.setActiveLayer(newLayer);
  }

  private pointSize(algorithm: ScaleAlgorithm, value: number, valueMin: number, valueMax: number, sizeMin: number, sizeMax: number): number {
    let size: number;

    if (valueMin === 0) {
      valueMin = 1;
    }

    if (ScaleAlgorithm.Absolute === algorithm) {
      size = Math.round((sizeMin * value) / valueMin);
    } else if (ScaleAlgorithm.Interpolated === algorithm) {
      size = Math.round(sizeMin + (sizeMax - sizeMin) * ((value - valueMin) / (valueMax - valueMin)));
    } else {
      throw new Error(`Unhandled algorithm: ${algorithm}`);
    }

    if (size < sizeMin) {
      return sizeMin;
    }
    if (size > sizeMax) {
      return sizeMax;
    }
    return size;
  }

  private handleParamsChange = (params: Parameters) => {
    this.params = params;
  };
}
