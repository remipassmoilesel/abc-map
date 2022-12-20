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

import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { MapFactory } from '../../core/geo/map/MapFactory';
import { ClassificationAlgorithm, ScaleAlgorithm } from '../../core/modules/Algorithm';
import VectorSource from 'ol/source/Vector';
import { newParameters, Parameters } from './typings/Parameters';
import { ColorGradientsModule, logger } from './ColorGradientsModule';
import { featuresToComparableValues, testGradientClasses } from './ColorGradientsModule.test.data';
import { TestHelper } from '../../core/utils/test/TestHelper';
import { Status } from './typings/ProcessingResult';
import { DataSource, DataValue } from '../../core/data/data-source/DataSource';
import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';
import { TestDataSource } from '../../core/data/data-source/TestDataSource';
import Geometry from 'ol/geom/Geometry';
import { mockServices, restoreServices } from '../../core/utils/test/mock-services';

logger.disable();

describe('ColorGradients', () => {
  let map: MapWrapper;
  let module: ColorGradientsModule;

  beforeEach(() => {
    map = MapFactory.createNaked();

    const services = mockServices();
    services.geo.getMainMap.returns(map);

    module = new ColorGradientsModule(services);
  });

  afterEach(() => {
    restoreServices();
  });

  it('should fail if parameter is missing', async () => {
    const error: Error = await module.process(newParameters()).catch((err) => err);
    expect(error.message).toEqual('Invalid parameters');
  });

  describe('With dataset 1 (regions of France)', () => {
    let source: DataSource;
    let layer: VectorLayerWrapper;
    let values: DataValue[];
    let baseParameters: Parameters;

    beforeEach(async () => {
      source = TestHelper.regionsOfFranceDataSource();
      values = (await source.getRows()).map((row) => row['popPercent']) as DataValue[];
      layer = TestHelper.regionsOfFranceVectorLayer();
      baseParameters = {
        newLayerName: 'New gradient layer',
        data: {
          source,
          valueField: 'popPercent',
          joinBy: 'code',
        },
        geometries: {
          layer: layer,
          joinBy: 'CODE',
        },
        colors: {
          start: '#000',
          end: '#FFF',
          algorithm: ScaleAlgorithm.Interpolated,
          classes: [],
        },
      };
    });

    it('with ScaleAlgorithm.Interpolated', async () => {
      // Prepare
      const parameters: Parameters = {
        ...baseParameters,
        colors: {
          ...baseParameters.colors,
          algorithm: ScaleAlgorithm.Interpolated,
        },
      };

      // Act
      const result = await module.process(parameters);

      // Assert
      expect(result).toEqual({
        status: Status.Succeed,
        featuresProcessed: 13,
        invalidFeatures: 0,
        invalidValues: [],
        missingDataRows: [],
      });

      expect(map.getLayers().length).toEqual(1);
      const newLayer = map.getLayers()[0];
      expect(newLayer.getName()).toEqual('New gradient layer');

      const features = (map.getLayers()[0].getSource() as VectorSource<Geometry>).getFeatures();
      expect(features.length).toEqual(13);

      const actual = featuresToComparableValues(features, 'code');
      expect(actual).toEqual([
        { color: '#a6a6a6', value: 0.124, joinedBy: 11 },
        { color: '#353535', value: 0.043, joinedBy: 22 },
        { color: '#404040', value: 0.051, joinedBy: 33 },
        { color: '#2f2f2f', value: 0.039, joinedBy: 44 },
        { color: '#000000', value: 0.005, joinedBy: 55 },
        { color: '#6e6e6e', value: 0.084, joinedBy: 66 },
        { color: '#787878', value: 0.091, joinedBy: 77 },
        { color: '#ffffff', value: 0.188, joinedBy: 88 },
        { color: '#3f3f3f', value: 0.05, joinedBy: 99 },
        { color: '#797979', value: 0.092, joinedBy: 910 },
        { color: '#787878', value: 0.091, joinedBy: 911 },
        { color: '#4a4a4a', value: 0.058, joinedBy: 912 },
        { color: '#666666', value: 0.078, joinedBy: 913 },
      ]);
    });

    it('with ClassificationAlgorithm.NaturalBreaks', async () => {
      // Prepare
      const classes = testGradientClasses(values, ClassificationAlgorithm.NaturalBreaks, 5);
      const parameters: Parameters = {
        ...baseParameters,
        colors: {
          ...baseParameters.colors,
          algorithm: ClassificationAlgorithm.NaturalBreaks,
          classes,
        },
      };

      // Act
      const result = await module.process(parameters);

      // Assert
      expect(result).toEqual({
        status: Status.Succeed,
        featuresProcessed: 13,
        invalidFeatures: 0,
        invalidValues: [],
        missingDataRows: [],
      });

      expect(map.getLayers().length).toEqual(1);
      const newLayer = map.getLayers()[0];
      expect(newLayer.getName()).toEqual('New gradient layer');

      const features = (map.getLayers()[0].getSource() as VectorSource<Geometry>).getFeatures();
      expect(features.length).toEqual(13);

      const actual = featuresToComparableValues(features, 'code');
      expect(actual).toEqual([
        { color: '#bf0040', value: 0.124, joinedBy: 11 },
        { color: '#4000bf', value: 0.043, joinedBy: 22 },
        { color: '#4000bf', value: 0.051, joinedBy: 33 },
        { color: '#4000bf', value: 0.039, joinedBy: 44 },
        { color: '#0000ff', value: 0.005, joinedBy: 55 },
        { color: '#800080', value: 0.084, joinedBy: 66 },
        { color: '#800080', value: 0.091, joinedBy: 77 },
        { color: '#ff0000', value: 0.188, joinedBy: 88 },
        { color: '#4000bf', value: 0.05, joinedBy: 99 },
        { color: '#800080', value: 0.092, joinedBy: 910 },
        { color: '#800080', value: 0.091, joinedBy: 911 },
        { color: '#4000bf', value: 0.058, joinedBy: 912 },
        { color: '#800080', value: 0.078, joinedBy: 913 },
      ]);
    });

    it('with ClassificationAlgorithm.Quantiles', async () => {
      // Prepare
      const classes = testGradientClasses(values, ClassificationAlgorithm.Quantiles, 5);
      const parameters: Parameters = {
        ...baseParameters,
        colors: {
          ...baseParameters.colors,
          algorithm: ClassificationAlgorithm.Quantiles,
          classes,
        },
      };

      // Act
      const result = await module.process(parameters);

      // Assert
      expect(result).toEqual({
        status: Status.Succeed,
        featuresProcessed: 13,
        invalidFeatures: 0,
        invalidValues: [],
        missingDataRows: [],
      });

      expect(map.getLayers().length).toEqual(1);
      const newLayer = map.getLayers()[0];
      expect(newLayer.getName()).toEqual('New gradient layer');

      const features = (map.getLayers()[0].getSource() as VectorSource<Geometry>).getFeatures();
      expect(features.length).toEqual(13);

      const actual = featuresToComparableValues(features, 'code');
      expect(actual).toEqual([
        { color: '#ff0000', value: 0.124, joinedBy: 11 },
        { color: '#0000ff', value: 0.043, joinedBy: 22 },
        { color: '#4000bf', value: 0.051, joinedBy: 33 },
        { color: '#0000ff', value: 0.039, joinedBy: 44 },
        { color: '#0000ff', value: 0.005, joinedBy: 55 },
        { color: '#800080', value: 0.084, joinedBy: 66 },
        { color: '#bf0040', value: 0.091, joinedBy: 77 },
        { color: '#ff0000', value: 0.188, joinedBy: 88 },
        { color: '#4000bf', value: 0.05, joinedBy: 99 },
        { color: '#bf0040', value: 0.092, joinedBy: 910 },
        { color: '#bf0040', value: 0.091, joinedBy: 911 },
        { color: '#4000bf', value: 0.058, joinedBy: 912 },
        { color: '#800080', value: 0.078, joinedBy: 913 },
      ]);
    });

    it('with ClassificationAlgorithm.EqualIntervals', async () => {
      // Prepare
      const classes = testGradientClasses(values, ClassificationAlgorithm.EqualIntervals, 5);
      const parameters: Parameters = {
        ...baseParameters,
        colors: {
          ...baseParameters.colors,
          algorithm: ClassificationAlgorithm.EqualIntervals,
          classes,
        },
      };

      // Act
      const result = await module.process(parameters);

      // Assert
      expect(result).toEqual({
        status: Status.Succeed,
        featuresProcessed: 13,
        invalidFeatures: 0,
        invalidValues: [],
        missingDataRows: [],
      });

      expect(map.getLayers().length).toEqual(1);
      const newLayer = map.getLayers()[0];
      expect(newLayer.getName()).toEqual('New gradient layer');

      const features = (map.getLayers()[0].getSource() as VectorSource<Geometry>).getFeatures();
      expect(features.length).toEqual(13);

      const actual = featuresToComparableValues(features, 'code');
      expect(actual).toEqual([
        { color: '#bf0040', value: 0.124, joinedBy: 11 },
        { color: '#4000bf', value: 0.043, joinedBy: 22 },
        { color: '#4000bf', value: 0.051, joinedBy: 33 },
        { color: '#0000ff', value: 0.039, joinedBy: 44 },
        { color: '#0000ff', value: 0.005, joinedBy: 55 },
        { color: '#800080', value: 0.084, joinedBy: 66 },
        { color: '#800080', value: 0.091, joinedBy: 77 },
        { color: '#ff0000', value: 0.188, joinedBy: 88 },
        { color: '#4000bf', value: 0.05, joinedBy: 99 },
        { color: '#800080', value: 0.092, joinedBy: 910 },
        { color: '#800080', value: 0.091, joinedBy: 911 },
        { color: '#4000bf', value: 0.058, joinedBy: 912 },
        { color: '#4000bf', value: 0.078, joinedBy: 913 },
      ]);
    });
  });

  describe('With a bad dataset', () => {
    const parameters = (source: DataSource, layer: VectorLayerWrapper): Parameters => ({
      newLayerName: 'New gradient layer',
      data: {
        source,
        valueField: 'popPercent',
        joinBy: 'code',
      },
      geometries: {
        layer: layer,
        joinBy: 'CODE',
      },
      colors: {
        start: '#000',
        end: '#FFF',
        algorithm: ScaleAlgorithm.Interpolated,
        classes: [],
      },
    });

    it('should return InvalidValues status', async () => {
      // Prepare
      const rows = TestHelper.regionsOfFrance();
      rows[0].popPercent = 'SeVeNtY PeRcEnT';
      const source = TestDataSource.from(rows);
      const layer = TestHelper.regionsOfFranceVectorLayer();

      // Act
      const result = await module.process(parameters(source, layer));

      // Assert
      expect(result).toEqual({
        status: Status.InvalidValues,
        featuresProcessed: 0,
        invalidFeatures: 0,
        invalidValues: ['popPercent: "SeVeNtY PeRcEnT"'],
        missingDataRows: [],
      });
    });

    it('should return InvalidMinMax status', async () => {
      // Prepare
      const rows = TestHelper.regionsOfFrance().map((row) => ({ ...row, popPercent: 0 }));
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
