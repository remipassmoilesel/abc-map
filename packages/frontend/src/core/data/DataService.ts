import { AxiosInstance } from 'axios';
import { AbcArtefact } from '@abc-map/shared-entities';
import { DatastoreRoutes as Api } from '../http/ApiRoutes';
import { Logger } from '@abc-map/frontend-shared';
import { DataReader } from './readers/DataReader';
import { AbcFile } from '@abc-map/frontend-shared';
import { LayerWrapper } from '../geo/layers/LayerWrapper';
import { GeoService } from '../geo/GeoService';
import { getArea } from 'ol/extent';
import { DateTime } from 'luxon';

const logger = Logger.get('DataService.ts');

export interface ImportResult {
  layers: LayerWrapper[];
}

export declare type DataReaderFactory = () => DataReader;

const defaultReaderFactory: DataReaderFactory = () => DataReader.create();

export class DataService {
  constructor(private apiClient: AxiosInstance, private downloadClient: AxiosInstance, private geo: GeoService, private readerFactory = defaultReaderFactory) {}

  public listArtefacts(): Promise<AbcArtefact[]> {
    return this.apiClient.get(Api.list()).then((res) => res.data);
  }

  public searchArtefacts(query: string): Promise<AbcArtefact[]> {
    const params = { query: encodeURI(query) };
    return this.apiClient.get(Api.search(), { params }).then((res) => res.data);
  }

  public downloadFilesFrom(artefact: AbcArtefact): Promise<AbcFile[]> {
    const files = artefact.files.map((file) => this.downloadClient.get(Api.download(file)).then((res) => ({ path: file, content: res.data })));
    return Promise.all(files);
  }

  public async importArtefact(artefact: AbcArtefact): Promise<ImportResult> {
    const files = await this.downloadFilesFrom(artefact);
    return this.importFiles(files);
  }

  public async importFiles(files: AbcFile[]): Promise<ImportResult> {
    const map = this.geo.getMainMap();
    const layers = await this.readerFactory().read(files, map.getProjection());
    if (!layers.length) {
      return { layers: [] };
    }

    // We add layers
    const hour = DateTime.local().toFormat('HH:mm');
    layers.forEach((lay, i) => {
      lay.setName(`Import de ${hour} (${i + 1})`);
      map.addLayer(lay);
    });

    // We set last one active
    const last = layers[layers.length - 1];
    map.setActiveLayer(last);

    // We fit view on last one
    const extent = last.unwrap().getExtent();
    if (extent && getArea(extent)) {
      map.unwrap().getView().fit(extent);
    }

    return { layers };
  }
}
