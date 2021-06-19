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

import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { GeoService } from '../../core/geo/GeoService';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { MapFactory } from '../../core/geo/map/MapFactory';
import { Services } from '../../core/Services';
import { ClassificationAlgorithm, ScaleAlgorithm } from '../_common/algorithm/Algorithm';
import VectorSource from 'ol/source/Vector';
import { newParameters, Parameters } from './Parameters';
import { ColorGradients, logger } from './ColorGradients';
import { featuresToComparableValues, testDataSource1, testGeometryLayer1, testGradientClasses } from './ColorGradients.test.data';

logger.disable();

describe('ColorGradients', () => {
  let geoMock: SinonStubbedInstance<GeoService>;
  let map: MapWrapper;
  let module: ColorGradients;

  beforeEach(() => {
    map = MapFactory.createNaked();
    geoMock = sinon.createStubInstance(GeoService);
    geoMock.getMainMap.returns(map);
    const services = { geo: geoMock } as unknown as Services;

    module = new ColorGradients(services);
  });

  it('should fail if parameter is missing', async () => {
    const error: Error = await module.process(newParameters()).catch((err) => err);
    expect(error.message).toEqual('Invalid parameters');
  });

  it('Test dataset 1 with ScaleAlgorithm.Interpolated', async () => {
    // Prepare
    const source = testDataSource1();
    const layer = testGeometryLayer1();

    // Act
    const parameters: Parameters = {
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
      },
    };

    await module.process(parameters);

    // Assert
    expect(map.getLayers().length).toEqual(1);
    const newLayer = map.getLayers()[0];
    expect(newLayer.getName()).toEqual('New gradient layer');

    const features = (map.getLayers()[0].getSource() as VectorSource).getFeatures();
    expect(features.length).toEqual(13);

    const actual = featuresToComparableValues(features, 'code');
    expect(actual).toEqual([
      { color: '#a6a6a6', value: 0.124, joinedBy: 1 },
      { color: '#353535', value: 0.043, joinedBy: 2 },
      { color: '#404040', value: 0.051, joinedBy: 3 },
      { color: '#2f2f2f', value: 0.039, joinedBy: 4 },
      { color: '#000000', value: 0.005, joinedBy: 5 },
      { color: '#6e6e6e', value: 0.084, joinedBy: 6 },
      { color: '#787878', value: 0.091, joinedBy: 7 },
      { color: '#ffffff', value: 0.188, joinedBy: 8 },
      { color: '#3f3f3f', value: 0.05, joinedBy: 9 },
      { color: '#797979', value: 0.092, joinedBy: 10 },
      { color: '#787878', value: 0.091, joinedBy: 11 },
      { color: '#4a4a4a', value: 0.058, joinedBy: 12 },
      { color: '#666666', value: 0.078, joinedBy: 13 },
    ]);
  });

  it('Test dataset 1 with ClassificationAlgorithm.NaturalBreaks', async () => {
    // Prepare
    const source = testDataSource1();
    const classes = testGradientClasses(ClassificationAlgorithm.NaturalBreaks, 5);
    const layer = testGeometryLayer1();

    // Act
    const parameters: Parameters = {
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
        algorithm: ClassificationAlgorithm.NaturalBreaks,
        classes,
      },
    };

    await module.process(parameters);

    // Assert
    expect(map.getLayers().length).toEqual(1);
    const newLayer = map.getLayers()[0];
    expect(newLayer.getName()).toEqual('New gradient layer');

    const features = (map.getLayers()[0].getSource() as VectorSource).getFeatures();
    expect(features.length).toEqual(13);

    const actual = featuresToComparableValues(features, 'code');
    expect(actual).toEqual([
      { color: '#bf0040', value: 0.124, joinedBy: 1 },
      { color: '#4000bf', value: 0.043, joinedBy: 2 },
      { color: '#4000bf', value: 0.051, joinedBy: 3 },
      { color: '#4000bf', value: 0.039, joinedBy: 4 },
      { color: '#0000ff', value: 0.005, joinedBy: 5 },
      { color: '#800080', value: 0.084, joinedBy: 6 },
      { color: '#800080', value: 0.091, joinedBy: 7 },
      { color: '#ff0000', value: 0.188, joinedBy: 8 },
      { color: '#4000bf', value: 0.05, joinedBy: 9 },
      { color: '#800080', value: 0.092, joinedBy: 10 },
      { color: '#800080', value: 0.091, joinedBy: 11 },
      { color: '#4000bf', value: 0.058, joinedBy: 12 },
      { color: '#800080', value: 0.078, joinedBy: 13 },
    ]);
  });

  it('Test dataset 1 with ClassificationAlgorithm.Quantiles', async () => {
    // Prepare
    const source = testDataSource1();
    const classes = testGradientClasses(ClassificationAlgorithm.Quantiles, 5);
    const layer = testGeometryLayer1();

    // Act
    const parameters: Parameters = {
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
        algorithm: ClassificationAlgorithm.Quantiles,
        classes,
      },
    };

    await module.process(parameters);

    // Assert
    expect(map.getLayers().length).toEqual(1);
    const newLayer = map.getLayers()[0];
    expect(newLayer.getName()).toEqual('New gradient layer');

    const features = (map.getLayers()[0].getSource() as VectorSource).getFeatures();
    expect(features.length).toEqual(13);

    const actual = featuresToComparableValues(features, 'code');
    expect(actual).toEqual([
      { color: '#ff0000', value: 0.124, joinedBy: 1 },
      { color: '#0000ff', value: 0.043, joinedBy: 2 },
      { color: '#4000bf', value: 0.051, joinedBy: 3 },
      { color: '#0000ff', value: 0.039, joinedBy: 4 },
      { color: '#0000ff', value: 0.005, joinedBy: 5 },
      { color: '#800080', value: 0.084, joinedBy: 6 },
      { color: '#bf0040', value: 0.091, joinedBy: 7 },
      { color: '#ff0000', value: 0.188, joinedBy: 8 },
      { color: '#4000bf', value: 0.05, joinedBy: 9 },
      { color: '#bf0040', value: 0.092, joinedBy: 10 },
      { color: '#bf0040', value: 0.091, joinedBy: 11 },
      { color: '#4000bf', value: 0.058, joinedBy: 12 },
      { color: '#800080', value: 0.078, joinedBy: 13 },
    ]);
  });

  it('Test dataset 1 with ClassificationAlgorithm.EqualIntervals', async () => {
    // Prepare
    const source = testDataSource1();
    const classes = testGradientClasses(ClassificationAlgorithm.EqualIntervals, 5);
    const layer = testGeometryLayer1();

    // Act
    const parameters: Parameters = {
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
        algorithm: ClassificationAlgorithm.EqualIntervals,
        classes,
      },
    };

    await module.process(parameters);

    // Assert
    expect(map.getLayers().length).toEqual(1);
    const newLayer = map.getLayers()[0];
    expect(newLayer.getName()).toEqual('New gradient layer');

    const features = (map.getLayers()[0].getSource() as VectorSource).getFeatures();
    expect(features.length).toEqual(13);

    const actual = featuresToComparableValues(features, 'code');
    expect(actual).toEqual([
      { color: '#bf0040', value: 0.124, joinedBy: 1 },
      { color: '#4000bf', value: 0.043, joinedBy: 2 },
      { color: '#4000bf', value: 0.051, joinedBy: 3 },
      { color: '#0000ff', value: 0.039, joinedBy: 4 },
      { color: '#0000ff', value: 0.005, joinedBy: 5 },
      { color: '#800080', value: 0.084, joinedBy: 6 },
      { color: '#800080', value: 0.091, joinedBy: 7 },
      { color: '#ff0000', value: 0.188, joinedBy: 8 },
      { color: '#4000bf', value: 0.05, joinedBy: 9 },
      { color: '#800080', value: 0.092, joinedBy: 10 },
      { color: '#800080', value: 0.091, joinedBy: 11 },
      { color: '#4000bf', value: 0.058, joinedBy: 12 },
      { color: '#4000bf', value: 0.078, joinedBy: 13 },
    ]);
  });
});
