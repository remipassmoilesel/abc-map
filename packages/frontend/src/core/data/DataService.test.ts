import { DataReaderFactory, DataService } from './DataService';
import { SinonStub, SinonStubbedInstance } from 'sinon';
import * as sinon from 'sinon';
import { GeoService } from '../geo/GeoService';
import { AxiosInstance } from 'axios';
import { LayerFactory } from '../geo/layers/LayerFactory';
import { MapFactory } from '../geo/map/MapFactory';
import { AbcFile } from '@abc-map/frontend-shared';

describe('DataService', () => {
  let apiClient: { get: SinonStub };
  let downloadClient: { get: SinonStub };
  let geoService: SinonStubbedInstance<GeoService>;
  let dataReader: SinonStub;
  let service: DataService;

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

    service = new DataService(
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
