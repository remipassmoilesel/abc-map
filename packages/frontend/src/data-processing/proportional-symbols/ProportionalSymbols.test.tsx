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

import { logger, ProportionalSymbols } from './ProportionalSymbols';
import { newParameters, Parameters } from './Parameters';
import { MapFactory } from '../../core/geo/map/MapFactory';
import VectorSource from 'ol/source/Vector';
import {
  featuresToComparableValues,
  testDataSource1,
  testDataSource2,
  testDataSource3,
  testGeometryLayer1,
  testGeometryLayer2,
  testGeometryLayer3,
} from './ProportionalSymbols.test.data';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { ScaleAlgorithm } from '../_common/algorithm/Algorithm';
import { IconName } from '../../assets/point-icons/IconName';
import { DataSource } from '../../core/data/data-source/DataSource';
import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import { Status } from './ProcessingResult';
import { TestHelper } from '../../core/utils/test/TestHelper';
import { TestDataSource } from '../../core/data/data-source/TestDataSource';
import Geometry from 'ol/geom/Geometry';
import { mockServices, restoreServices } from '../../core/utils/test/mock-services';

logger.disable();

describe('ProportionalSymbols', () => {
  let map: MapWrapper;
  let module: ProportionalSymbols;

  beforeEach(() => {
    map = MapFactory.createNaked();

    const services = mockServices();
    services.geo.getMainMap.returns(map);

    module = new ProportionalSymbols(services);
  });

  afterAll(() => {
    restoreServices();
  });

  it('should fail if parameter is missing', async () => {
    const error: Error = await module.process(newParameters()).catch((err) => err);
    expect(error.message).toEqual('Invalid parameters');
  });

  describe('With dataset 1', () => {
    const baseParameters = (source: DataSource, layer: VectorLayerWrapper): Parameters => ({
      newLayerName: 'New layer name',
      data: {
        source,
        valueField: 'population',
        joinBy: 'code_reg',
      },
      geometries: {
        layer,
        joinBy: 'CODE',
      },
      symbols: {
        type: IconName.IconPlusCircleFill,
        color: '#0094e3',
        sizeMin: 2,
        sizeMax: 100,
        algorithm: ScaleAlgorithm.Absolute,
      },
    });

    it('with Absolute scaling algorithm', async () => {
      // Prepare
      const source = testDataSource1();
      const layer = testGeometryLayer1();

      const parameters: Parameters = {
        ...baseParameters(source, layer),
        symbols: {
          type: IconName.IconPlusCircleFill,
          color: '#0094e3',
          sizeMin: 2,
          sizeMax: 100,
          algorithm: ScaleAlgorithm.Absolute,
        },
      };

      // Act
      const result = await module.process(parameters);

      // Assert
      expect(result).toEqual({ status: Status.Succeed, featuresProcessed: 4, invalidFeatures: 0, missingDataRows: [], invalidValues: [] });

      expect(map.getLayers().length).toEqual(1);
      const newLayer = map.getLayers()[0];
      expect(newLayer.getName()).toEqual('New layer name');

      const features = (map.getLayers()[0].getSource() as VectorSource<Geometry>).getFeatures();
      expect(features.length).toEqual(4);

      const comparable = featuresToComparableValues(features, 'code_reg');

      expect(comparable).toEqual([
        { joinedBy: '04', size: 2, value: 164068 },
        { joinedBy: '03', size: 4, value: 337171 },
        { joinedBy: '02', size: 7, value: 533316 },
        { joinedBy: '01', size: 8, value: 647634 },
      ]);
    });

    it('with Absolute scaling algorithm and max constraint', async () => {
      // Prepare
      const source = testDataSource1();
      const layer = testGeometryLayer1();

      const parameters: Parameters = {
        ...baseParameters(source, layer),
        symbols: {
          type: IconName.IconPlusCircleFill,
          color: '#0094e3',
          sizeMin: 2,
          sizeMax: 6,
          algorithm: ScaleAlgorithm.Absolute,
        },
      };

      // Act
      const result = await module.process(parameters);

      // Assert
      expect(result).toEqual({ status: Status.Succeed, featuresProcessed: 4, invalidFeatures: 0, missingDataRows: [], invalidValues: [] });

      expect(map.getLayers().length).toEqual(1);
      const newLayer = map.getLayers()[0];
      expect(newLayer.getName()).toEqual('New layer name');
      const features = (map.getLayers()[0].getSource() as VectorSource<Geometry>).getFeatures();
      expect(features.length).toEqual(4);

      const comparable = featuresToComparableValues(features, 'code_reg');
      expect(comparable).toEqual([
        { size: 2, value: 164068, joinedBy: '04' },
        { size: 4, value: 337171, joinedBy: '03' },
        { size: 6, value: 533316, joinedBy: '02' },
        { size: 6, value: 647634, joinedBy: '01' },
      ]);
    });

    it('with Interpolated scaling algorithm', async () => {
      // Prepare
      const source = testDataSource1();
      const layer = testGeometryLayer1();

      const parameters: Parameters = {
        ...baseParameters(source, layer),
        symbols: {
          type: IconName.IconPlusCircleFill,
          color: '#0094e3',
          sizeMin: 2,
          sizeMax: 100,
          algorithm: ScaleAlgorithm.Interpolated,
        },
      };

      // Act
      const result = await module.process(parameters);

      // Assert
      expect(result).toEqual({ status: Status.Succeed, featuresProcessed: 4, invalidFeatures: 0, missingDataRows: [], invalidValues: [] });

      expect(map.getLayers().length).toEqual(1);
      const newLayer = map.getLayers()[0];
      expect(newLayer.getName()).toEqual('New layer name');

      const features = (map.getLayers()[0].getSource() as VectorSource<Geometry>).getFeatures();
      const comparable = featuresToComparableValues(features, 'code_reg');
      expect(comparable).toEqual([
        { size: 2, value: 164068, joinedBy: '04' },
        { size: 37, value: 337171, joinedBy: '03' },
        { size: 77, value: 533316, joinedBy: '02' },
        { size: 100, value: 647634, joinedBy: '01' },
      ]);
    });
  });

  describe('With dataset 2 and 3', () => {
    const baseParameters = (source: DataSource, layer: VectorLayerWrapper): Parameters => ({
      newLayerName: 'New layer name',
      data: {
        source,
        valueField: 'value',
        joinBy: 'code',
      },
      geometries: {
        layer,
        joinBy: 'code',
      },
      symbols: {
        type: IconName.IconPlusCircleFill,
        color: '#0094e3',
        sizeMin: 2,
        sizeMax: 100,
        algorithm: ScaleAlgorithm.Interpolated,
      },
    });

    it('with Interpolated scaling algorithm', async () => {
      // Prepare
      const source = testDataSource2();
      const layer = testGeometryLayer2();

      // Act
      const parameters: Parameters = {
        ...baseParameters(source, layer),
        symbols: {
          type: IconName.IconPlusCircleFill,
          color: '#0094e3',
          sizeMin: 2,
          sizeMax: 100,
          algorithm: ScaleAlgorithm.Interpolated,
        },
      };

      const result = await module.process(parameters);

      // Assert
      expect(result).toEqual({ status: Status.Succeed, featuresProcessed: 18, invalidFeatures: 0, missingDataRows: [], invalidValues: [] });

      expect(map.getLayers().length).toEqual(1);
      const newLayer = map.getLayers()[0];
      expect(newLayer.getName()).toEqual('New layer name');

      const features = (map.getLayers()[0].getSource() as VectorSource<Geometry>).getFeatures();
      const comparable = featuresToComparableValues(features, 'code');
      expect(comparable).toEqual([
        { size: 2, value: 377.730620008599, joinedBy: 1 },
        { size: 3, value: 1089.36697551601, joinedBy: 2 },
        { size: 3, value: 1634.1807405057, joinedBy: 3 },
        { size: 4, value: 2504.8084547204, joinedBy: 4 },
        { size: 12, value: 8728.32490346905, joinedBy: 5 },
        { size: 16, value: 12069.9719351141, joinedBy: 6 },
        { size: 34, value: 27630.7566577526, joinedBy: 7 },
        { size: 37, value: 30139.2938373139, joinedBy: 8 },
        { size: 39, value: 31840.4276059089, joinedBy: 9 },
        { size: 39, value: 31978.3795751166, joinedBy: 10 },
        { size: 39, value: 32431.2716032757, joinedBy: 11 },
        { size: 47, value: 39530.669755169, joinedBy: 12 },
        { size: 57, value: 48059.6549778473, joinedBy: 13 },
        { size: 69, value: 57717.6338705954, joinedBy: 14 },
        { size: 84, value: 71134.3725767045, joinedBy: 15 },
        { size: 87, value: 73367.0697261891, joinedBy: 16 },
        { size: 99, value: 83550.7462972935, joinedBy: 17 },
        { size: 100, value: 84841.8565894046, joinedBy: 18 },
      ]);
    });

    it('with Absolute algorithm should handle zero code and values', async () => {
      // Prepare
      const source = testDataSource3();
      const layer = testGeometryLayer3();

      // Act
      const parameters: Parameters = {
        ...baseParameters(source, layer),
        symbols: {
          type: IconName.IconPlusCircleFill,
          color: '#0094e3',
          sizeMin: 2,
          sizeMax: 100,
          algorithm: ScaleAlgorithm.Absolute,
        },
      };

      const result = await module.process(parameters);

      // Assert
      expect(result).toEqual({ status: Status.Succeed, featuresProcessed: 3, invalidFeatures: 0, missingDataRows: [], invalidValues: [] });

      expect(map.getLayers().length).toEqual(1);
      const newLayer = map.getLayers()[0];
      expect(newLayer.getName()).toEqual('New layer name');

      const features = (map.getLayers()[0].getSource() as VectorSource<Geometry>).getFeatures();
      const comparable = featuresToComparableValues(features, 'code');
      expect(comparable).toEqual([
        { size: 4, value: 2, joinedBy: 2 },
        { size: 6, value: 3, joinedBy: 3 },
        { size: 10, value: 5, joinedBy: 0 },
      ]);
    });

    it('with Interpolated algorithm should handle zero code and values', async () => {
      // Prepare
      const source = testDataSource3();
      const layer = testGeometryLayer3();

      // Act
      const parameters: Parameters = {
        ...baseParameters(source, layer),
        symbols: {
          type: IconName.IconPlusCircleFill,
          color: '#0094e3',
          sizeMin: 2,
          sizeMax: 100,
          algorithm: ScaleAlgorithm.Interpolated,
        },
      };

      const result = await module.process(parameters);

      // Assert
      expect(result).toEqual({ status: Status.Succeed, featuresProcessed: 3, invalidFeatures: 0, missingDataRows: [], invalidValues: [] });

      expect(map.getLayers().length).toEqual(1);
      const newLayer = map.getLayers()[0];
      expect(newLayer.getName()).toEqual('New layer name');

      const features = (map.getLayers()[0].getSource() as VectorSource<Geometry>).getFeatures();
      const comparable = featuresToComparableValues(features, 'code');
      expect(comparable).toEqual([
        { size: 27, value: 2, joinedBy: 2 },
        { size: 51, value: 3, joinedBy: 3 },
        { size: 100, value: 5, joinedBy: 0 },
      ]);
    });
  });

  describe('With a bad dataset', () => {
    const parameters = (source: DataSource, layer: VectorLayerWrapper): Parameters => ({
      newLayerName: 'New layer name',
      data: {
        source,
        valueField: 'population',
        joinBy: 'code',
      },
      geometries: {
        layer: layer,
        joinBy: 'CODE',
      },
      symbols: {
        type: IconName.Icon0Circle,
        color: '#FFF',
        sizeMin: 1,
        sizeMax: 100,
        algorithm: ScaleAlgorithm.Interpolated,
      },
    });

    it('should return InvalidValues status', async () => {
      // Prepare
      const rows = TestHelper.regionsOfFrance();
      rows[0].population = 'SeVeNtY PeRcEnT';
      const source = TestDataSource.from(rows);
      const layer = TestHelper.regionsOfFranceVectorLayer();

      // Act
      const result = await module.process(parameters(source, layer));

      // Assert
      expect(result).toEqual({
        status: Status.InvalidValues,
        featuresProcessed: 0,
        invalidFeatures: 0,
        invalidValues: ['population: "SeVeNtY PeRcEnT"'],
        missingDataRows: [],
      });
    });

    it('should return InvalidMinMax status', async () => {
      // Prepare
      const rows = TestHelper.regionsOfFrance().map((row) => ({ ...row, population: 0 }));
      const source = TestDataSource.from(rows);
      const layer = TestHelper.regionsOfFranceVectorLayer();

      // Act
      const result = await module.process(parameters(source, layer));

      // Assert
      expect(result).toEqual({
        status: Status.InvalidMinMax,
        featuresProcessed: 0,
        invalidFeatures: 0,
        invalidValues: ['Minimum: 0', 'Maximum: 0'],
        missingDataRows: [],
      });
    });

    it('should return BadProcessing status if feature does not have join field', async () => {
      // Prepare
      const source = TestHelper.regionsOfFranceDataSource();
      const layer = TestHelper.regionsOfFranceVectorLayer();
      layer.getSource().getFeatures()[0].set('CODE', undefined);

      // Act
      const result = await module.process(parameters(source, layer));

      // Assert
      expect(result).toEqual({
        status: Status.BadProcessing,
        featuresProcessed: 12,
        invalidFeatures: 1,
        invalidValues: [],
        missingDataRows: [],
      });
    });

    it('should return BadProcessing status if feature does not have a matching data row', async () => {
      // Prepare
      const rows = TestHelper.regionsOfFrance();
      rows[0].code = 9999;
      const source = TestDataSource.from(rows);
      const layer = TestHelper.regionsOfFranceVectorLayer();

      // Act
      const result = await module.process(parameters(source, layer));

      // Assert
      expect(result).toEqual({
        status: Status.BadProcessing,
        featuresProcessed: 12,
        invalidFeatures: 0,
        invalidValues: [],
        missingDataRows: ['11'],
      });
    });
  });
});
