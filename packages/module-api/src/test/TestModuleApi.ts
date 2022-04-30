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
import { SinonStub, SinonStubbedInstance } from 'sinon';
import { ModuleApi } from '../ModuleApi';
import { FeatureWrapper, FeatureWrapperFactory } from '../features';
import { MapFactory, MapWrapper } from '../map';
import Feature from 'ol/Feature';
import { LayerFactory } from '../layers';
import { newTestMapWrapper } from './TestMapWrapper';
import { newTestGeoService } from './TestGeoService';
import { GeoService } from '../services';
import Geometry from 'ol/geom/Geometry';

export interface TestModuleApi {
  resourceBaseUrl: string;
  FeatureWrapperFactory: {
    from: SinonStub<[Feature<Geometry>], FeatureWrapper>;
    fromUnknown: SinonStub<[Feature<Geometry>], FeatureWrapper | undefined>;
  };
  LayerFactory: {
    newPredefinedLayer: SinonStub;
    newVectorLayer: SinonStub;
    newWmsLayer: SinonStub;
    newWmtsLayer: SinonStub;
    newXyzLayer: SinonStub;
  };
  MapFactory: {
    from: SinonStub;
    fromUnknown: SinonStub;
  };
  mainMap: SinonStubbedInstance<MapWrapper>;
  services: {
    geo: SinonStubbedInstance<GeoService>;
  };
}

type SameKeys<T> = {
  [P in keyof T]: SinonStub | SinonStubbedInstance<any>;
};

export function testModuleApi(): TestModuleApi {
  // SameKeys acts as a type check

  const FeatureWrapperFactory: SameKeys<FeatureWrapperFactory> = {
    from: sinon.stub(),
    fromUnknown: sinon.stub(),
  };

  const LayerFactory: SameKeys<LayerFactory> = {
    newPredefinedLayer: sinon.stub(),
    newVectorLayer: sinon.stub(),
    newWmsLayer: sinon.stub(),
    newWmtsLayer: sinon.stub(),
    newXyzLayer: sinon.stub(),
  };

  const MapFactory: SameKeys<MapFactory> = {
    from: sinon.stub(),
    fromUnknown: sinon.stub(),
  };

  const api: SameKeys<ModuleApi> = {
    resourceBaseUrl: 'http://test-resourceBaseUrl/',
    FeatureWrapperFactory,
    LayerFactory,
    MapFactory,
    mainMap: newTestMapWrapper(),
    services: {
      geo: newTestGeoService(),
    },
  };

  return api;
}

declare const global: any;

/**
 * This functions creates a fake module API composed of stubs.
 */
export function initTestModuleApi(): TestModuleApi {
  global.moduleApi = testModuleApi();
  return global.moduleApi;
}
