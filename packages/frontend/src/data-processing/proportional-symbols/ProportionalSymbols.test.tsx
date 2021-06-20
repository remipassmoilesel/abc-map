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
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { GeoService } from '../../core/geo/GeoService';
import { Services } from '../../core/Services';
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
import { StyleProperties } from '@abc-map/shared';
import { MapWrapper } from '../../core/geo/map/MapWrapper';
import { ScaleAlgorithm } from '../_common/algorithm/Algorithm';
import { PointIconName } from '../../assets/point-icons/PointIconName';

logger.disable();

describe('ProportionalSymbols', () => {
  let geoMock: SinonStubbedInstance<GeoService>;
  let map: MapWrapper;
  let module: ProportionalSymbols;

  beforeEach(() => {
    map = MapFactory.createNaked();
    geoMock = sinon.createStubInstance(GeoService);
    geoMock.getMainMap.returns(map);
    const services = { geo: geoMock } as unknown as Services;

    module = new ProportionalSymbols(services);
  });

  it('should fail if parameter is missing', async () => {
    const error: Error = await module.process(newParameters()).catch((err) => err);
    expect(error.message).toEqual('Invalid parameters');
  });

  it('Test dataset 1 with Absolute scaling algorithm', async () => {
    // Prepare
    const source = testDataSource1();
    const layer = testGeometryLayer1();

    // Act
    const parameters: Parameters = {
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
        type: PointIconName.IconPlusCircleFill,
        color: '#0094e3',
        sizeMin: 2,
        sizeMax: 100,
        algorithm: ScaleAlgorithm.Absolute,
      },
    };

    await module.process(parameters);

    // Assert
    expect(map.getLayers().length).toEqual(1);
    const newLayer = map.getLayers()[0];
    expect(newLayer.getName()).toEqual('New layer name');

    const features = (map.getLayers()[0].getSource() as VectorSource).getFeatures();
    expect(features.length).toEqual(4);

    const feat1 = features[0].getProperties();
    expect(feat1[StyleProperties.PointSize]).toEqual(8);
    expect(feat1['code_reg']).toEqual('01');
    expect(feat1['point-value']).toEqual(647_634);

    const feat2 = features[1].getProperties();
    expect(feat2[StyleProperties.PointSize]).toEqual(7);
    expect(feat2['code_reg']).toEqual('02');
    expect(feat2['point-value']).toEqual(533_316);

    const feat3 = features[2].getProperties();
    expect(feat3[StyleProperties.PointSize]).toEqual(4);
    expect(feat3['code_reg']).toEqual('03');
    expect(feat3['point-value']).toEqual(337_171);

    const feat4 = features[3].getProperties();
    expect(feat4[StyleProperties.PointSize]).toEqual(2);
    expect(feat4['code_reg']).toEqual('04');
    expect(feat4['point-value']).toEqual(164_068);
  });

  it('Test dataset 1 with Absolute scaling algorithm and max constraint', async () => {
    // Prepare
    const source = testDataSource1();
    const layer = testGeometryLayer1();

    // Act
    const parameters: Parameters = {
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
        type: PointIconName.IconPlusCircleFill,
        color: '#0094e3',
        sizeMin: 2,
        sizeMax: 6,
        algorithm: ScaleAlgorithm.Absolute,
      },
    };

    await module.process(parameters);

    // Assert
    expect(map.getLayers().length).toEqual(1);
    const newLayer = map.getLayers()[0];
    expect(newLayer.getName()).toEqual('New layer name');
    const features = (map.getLayers()[0].getSource() as VectorSource).getFeatures();
    expect(features.length).toEqual(4);

    const comparable = featuresToComparableValues(features, 'code_reg');
    expect(comparable).toEqual([
      { size: 2, value: 164068, joinedBy: '04' },
      { size: 4, value: 337171, joinedBy: '03' },
      { size: 6, value: 533316, joinedBy: '02' },
      { size: 6, value: 647634, joinedBy: '01' },
    ]);
  });

  it('Test dataset 1 with Interpolated scaling algorithm', async () => {
    // Prepare
    const source = testDataSource1();
    const layer = testGeometryLayer1();

    // Act
    const parameters: Parameters = {
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
        type: PointIconName.IconPlusCircleFill,
        color: '#0094e3',
        sizeMin: 2,
        sizeMax: 100,
        algorithm: ScaleAlgorithm.Interpolated,
      },
    };

    await module.process(parameters);

    // Assert
    expect(map.getLayers().length).toEqual(1);
    const newLayer = map.getLayers()[0];
    expect(newLayer.getName()).toEqual('New layer name');

    const features = (map.getLayers()[0].getSource() as VectorSource).getFeatures();
    const comparable = featuresToComparableValues(features, 'code_reg');
    expect(comparable).toEqual([
      { size: 2, value: 164068, joinedBy: '04' },
      { size: 37, value: 337171, joinedBy: '03' },
      { size: 77, value: 533316, joinedBy: '02' },
      { size: 100, value: 647634, joinedBy: '01' },
    ]);
  });

  it('Test dataset 2 with Interpolated scaling algorithm', async () => {
    // Prepare
    const source = testDataSource2();
    const layer = testGeometryLayer2();

    // Act
    const parameters: Parameters = {
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
        type: PointIconName.IconPlusCircleFill,
        color: '#0094e3',
        sizeMin: 2,
        sizeMax: 100,
        algorithm: ScaleAlgorithm.Interpolated,
      },
    };

    await module.process(parameters);

    // Assert
    expect(map.getLayers().length).toEqual(1);
    const newLayer = map.getLayers()[0];
    expect(newLayer.getName()).toEqual('New layer name');

    const features = (map.getLayers()[0].getSource() as VectorSource).getFeatures();
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

  it('Test dataset 3 with Absolute algorithm should handle zero code and values', async () => {
    // Prepare
    const source = testDataSource3();
    const layer = testGeometryLayer3();

    // Act
    const parameters: Parameters = {
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
        type: PointIconName.IconPlusCircleFill,
        color: '#0094e3',
        sizeMin: 2,
        sizeMax: 100,
        algorithm: ScaleAlgorithm.Absolute,
      },
    };

    await module.process(parameters);

    // Assert
    expect(map.getLayers().length).toEqual(1);
    const newLayer = map.getLayers()[0];
    expect(newLayer.getName()).toEqual('New layer name');

    const features = (map.getLayers()[0].getSource() as VectorSource).getFeatures();
    const comparable = featuresToComparableValues(features, 'code');
    expect(comparable).toEqual([
      { size: 4, value: 2, joinedBy: 2 },
      { size: 6, value: 3, joinedBy: 3 },
      { size: 10, value: 5, joinedBy: 0 },
    ]);
  });

  it('Test dataset 3 with Interpolated algorithm should handle zero code and values', async () => {
    // Prepare
    const source = testDataSource3();
    const layer = testGeometryLayer3();

    // Act
    const parameters: Parameters = {
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
        type: PointIconName.IconPlusCircleFill,
        color: '#0094e3',
        sizeMin: 2,
        sizeMax: 100,
        algorithm: ScaleAlgorithm.Interpolated,
      },
    };

    await module.process(parameters);

    // Assert
    expect(map.getLayers().length).toEqual(1);
    const newLayer = map.getLayers()[0];
    expect(newLayer.getName()).toEqual('New layer name');

    const features = (map.getLayers()[0].getSource() as VectorSource).getFeatures();
    const comparable = featuresToComparableValues(features, 'code');
    expect(comparable).toEqual([
      { size: 27, value: 2, joinedBy: 2 },
      { size: 51, value: 3, joinedBy: 3 },
      { size: 100, value: 5, joinedBy: 0 },
    ]);
  });
});
