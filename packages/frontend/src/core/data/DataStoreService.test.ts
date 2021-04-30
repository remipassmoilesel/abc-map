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

import { DataReaderFactory, DataStoreService } from './DataStoreService';
import { SinonStub, SinonStubbedInstance } from 'sinon';
import * as sinon from 'sinon';
import { GeoService } from '../geo/GeoService';
import { AxiosInstance } from 'axios';
import { LayerFactory } from '../geo/layers/LayerFactory';
import { MapFactory } from '../geo/map/MapFactory';
import { AbcFile } from '@abc-map/frontend-commons';

describe('DataStoreService', () => {
  let apiClient: { get: SinonStub };
  let downloadClient: { get: SinonStub };
  let geoService: SinonStubbedInstance<GeoService>;
  let dataReader: SinonStub;
  let service: DataStoreService;

  beforeEach(() => {
    apiClient = {
      get: sinon.stub(),
    };
    downloadClient = {
      get: sinon.stub(),
    };
    geoService = sinon.createStubInstance(GeoService);
    dataReader = sinon.stub();
    const readerFactory = sinon.stub().returns({ read: dataReader });

    service = new DataStoreService(
      (apiClient as unknown) as AxiosInstance,
      (downloadClient as unknown) as AxiosInstance,
      (geoService as unknown) as GeoService,
      (readerFactory as unknown) as DataReaderFactory
    );
  });

  it('importFiles()', async () => {
    const map = MapFactory.createNaked();
    dataReader.resolves([LayerFactory.newVectorLayer()]);
    geoService.getMainMap.returns(map);

    const files: AbcFile[] = [{ path: '/test/path', content: {} as Blob }];
    await service.importFiles(files);

    expect(dataReader.callCount).toEqual(1);
    expect(dataReader.getCall(0).args[0]).toStrictEqual(files);
    expect(dataReader.getCall(0).args[1]).toEqual(map.getProjection());

    expect(map.getLayers()).toHaveLength(1);
    expect(map.getLayers()[0].getName()).toMatch(/Import/);
    expect(map.getLayers()[0].isActive()).toEqual(true);
  });
});
