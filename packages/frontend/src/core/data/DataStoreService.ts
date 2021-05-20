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

import { AxiosInstance } from 'axios';
import { AbcArtefact } from '@abc-map/shared';
import { DatastoreRoutes as Api } from '../http/ApiRoutes';
import { Logger } from '@abc-map/shared';
import { DataReader } from './readers/DataReader';
import { AbcFile } from '@abc-map/shared';
import { LayerWrapper } from '../geo/layers/LayerWrapper';
import { GeoService } from '../geo/GeoService';
import { getArea } from 'ol/extent';
import { DateTime } from 'luxon';
import { BlobIO } from '@abc-map/shared';
import { PaginatedResponse } from '@abc-map/shared';

const logger = Logger.get('DataService.ts');

export interface ImportResult {
  layers: LayerWrapper[];
}

export declare type DataReaderFactory = () => DataReader;

const defaultReaderFactory: DataReaderFactory = () => DataReader.create();

export class DataStoreService {
  constructor(private apiClient: AxiosInstance, private downloadClient: AxiosInstance, private geo: GeoService, private readerFactory = defaultReaderFactory) {}

  public listArtefacts(limit = 50, offset = 0): Promise<PaginatedResponse<AbcArtefact>> {
    const params = { limit, offset };
    return this.apiClient.get(Api.list(), { params }).then((res) => res.data);
  }

  public searchArtefacts(query: string, limit = 50, offset = 0): Promise<PaginatedResponse<AbcArtefact>> {
    const params = { query: encodeURI(query), limit, offset };
    return this.apiClient.get(Api.search(), { params }).then((res) => res.data);
  }

  public downloadFilesFrom(artefact: AbcArtefact): Promise<AbcFile<Blob>[]> {
    const files = artefact.files.map((file) => this.downloadClient.get(Api.download(file)).then((res) => ({ path: file, content: res.data })));
    return Promise.all(files);
  }

  public downloadLicense(artefact: AbcArtefact): Promise<string> {
    return this.downloadClient.get(Api.download(artefact.license)).then((res) => BlobIO.asString(res.data));
  }

  public async importArtefact(artefact: AbcArtefact): Promise<ImportResult> {
    const files = await this.downloadFilesFrom(artefact);
    return this.importFiles(files);
  }

  public async importFiles(files: AbcFile<Blob>[]): Promise<ImportResult> {
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
