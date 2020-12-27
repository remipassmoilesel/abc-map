import { AxiosInstance } from 'axios';
import { AbcArtefact, AbcProjection } from '@abc-map/shared-entities';
import { DatastoreRoutes } from '../http/ApiRoutes';
import { Logger } from '../utils/Logger';
import BaseLayer from 'ol/layer/Base';
import { DataReader } from '../data-readers/DataReader';
import { AbcFile } from '../data-readers/AbcFile';

const logger = Logger.get('DatastoreService.ts');

export class DatastoreService {
  constructor(private apiClient: AxiosInstance, private downloadClient: AxiosInstance) {}

  public list(): Promise<AbcArtefact[]> {
    return this.apiClient.get(DatastoreRoutes.list()).then((res) => res.data);
  }

  public search(query: string): Promise<AbcArtefact[]> {
    const params = { query: encodeURI(query) };
    return this.apiClient.get(DatastoreRoutes.search(), { params }).then((res) => res.data);
  }

  public downloadFiles(artefact: AbcArtefact): Promise<AbcFile[]> {
    const files = artefact.files.map((file) => this.downloadClient.get(`/datastore/download/${file}`).then((res) => ({ path: file, content: res.data })));
    return Promise.all(files);
  }

  public async getLayersFrom(artefact: AbcArtefact, projection: AbcProjection): Promise<BaseLayer[]> {
    const files = await this.downloadFiles(artefact);
    return DataReader.create().read(files, projection);
  }
}
