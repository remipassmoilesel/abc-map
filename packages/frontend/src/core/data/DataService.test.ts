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

import { DataReaderFactory, DataService, MAX_RECOMMENDED_SIZE } from './DataService';
import * as sinon from 'sinon';
import { SinonStub, SinonStubbedInstance } from 'sinon';
import { GeoService } from '../geo/GeoService';
import { AxiosInstance } from 'axios';
import { LayerFactory } from '../geo/layers/LayerFactory';
import { MapFactory } from '../geo/map/MapFactory';
import { AbcFile } from '@abc-map/shared';
import { ToastService } from '../ui/ToastService';
import { ModalService } from '../ui/ModalService';
import { HistoryService } from '../history/HistoryService';
import { ModalStatus } from '../ui/typings';

describe('DataService', () => {
  let apiClient: { get: SinonStub };
  let downloadClient: { get: SinonStub };
  let geo: SinonStubbedInstance<GeoService>;
  let toasts: SinonStubbedInstance<ToastService>;
  let modals: SinonStubbedInstance<ModalService>;
  let history: SinonStubbedInstance<HistoryService>;
  let dataReader: SinonStub;
  let service: DataService;

  beforeEach(() => {
    apiClient = { get: sinon.stub() };
    downloadClient = { get: sinon.stub() };
    geo = sinon.createStubInstance(GeoService);
    modals = sinon.createStubInstance(ModalService);
    history = sinon.createStubInstance(HistoryService);
    toasts = sinon.createStubInstance(ToastService);
    dataReader = sinon.stub();
    const readerFactory = sinon.stub().returns({ read: dataReader });

    service = new DataService(
      apiClient as unknown as AxiosInstance,
      downloadClient as unknown as AxiosInstance,
      toasts as unknown as ToastService,
      geo as unknown as GeoService,
      modals as unknown as ModalService,
      history as unknown as HistoryService,
      readerFactory as unknown as DataReaderFactory
    );
  });

  describe('importFiles()', () => {
    it('should import file', async () => {
      const map = MapFactory.createNaked();
      dataReader.resolves([LayerFactory.newVectorLayer()]);
      geo.getMainMap.returns(map);

      const files: AbcFile<Blob>[] = [{ path: '/test/path', content: {} as Blob }];
      await service.importFiles(files);

      expect(dataReader.callCount).toEqual(1);
      expect(dataReader.getCall(0).args[0]).toStrictEqual(files);
      expect(dataReader.getCall(0).args[1]).toEqual(map.getProjection());

      expect(map.getLayers()).toHaveLength(1);
      expect(map.getLayers()[0].getName()).toMatch(/Import/);
      expect(map.getLayers()[0].isActive()).toEqual(true);
    });

    it('should warn if file is too big, and not import file if user cancel', async () => {
      modals.dataSizeWarning.resolves(ModalStatus.Canceled);

      const files: AbcFile<Blob>[] = [{ path: '/test/path', content: { size: MAX_RECOMMENDED_SIZE } as Blob }];
      await service.importFiles(files);

      expect(dataReader.callCount).toEqual(0);
    });

    it('should warn if file is too big, and import file if user confirm', async () => {
      const map = MapFactory.createNaked();
      geo.getMainMap.returns(map);
      dataReader.resolves([LayerFactory.newVectorLayer()]);
      modals.dataSizeWarning.resolves(ModalStatus.Confirmed);

      const files: AbcFile<Blob>[] = [{ path: '/test/path', content: { size: MAX_RECOMMENDED_SIZE } as Blob }];
      await service.importFiles(files);

      expect(dataReader.callCount).toEqual(1);
      expect(map.getLayers()).toHaveLength(1);
      expect(map.getLayers()[0].getName()).toMatch(/Import/);
      expect(map.getLayers()[0].isActive()).toEqual(true);
    });
  });
});
