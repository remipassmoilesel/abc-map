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
import { AbcArtefact, AbcFile, BlobIO, Logger, PaginatedResponse } from '@abc-map/shared';
import { DatastoreRoutes as Api } from '../http/ApiRoutes';
import { DataReader } from './readers/DataReader';
import { GeoService } from '../geo/GeoService';
import { getArea } from 'ol/extent';
import { DateTime } from 'luxon';
import { ToastService } from '../ui/ToastService';
import { ModalService } from '../ui/ModalService';
import { ModalStatus } from '../ui/typings';
import { HistoryKey } from '../history/HistoryKey';
import { AddLayersChangeset } from '../history/changesets/layers/AddLayersChangeset';
import { HistoryService } from '../history/HistoryService';
import { getLang, prefixedTranslation } from '../../i18n/i18n';

const logger = Logger.get('DataService.ts');

const t = prefixedTranslation('core:DataService.');

export const MAX_RECOMMENDED_SIZE = 5 * 1024 * 1024;
export const MAX_RECOMMENDED_FEATURES = 1000;

export enum ImportStatus {
  Succeed = 'Succeed',
  Failed = 'Failed',
  Canceled = 'Canceled',
}

export interface ImportResult {
  status: ImportStatus;
}

export declare type DataReaderFactory = () => DataReader;

const defaultReaderFactory: DataReaderFactory = () => DataReader.create();

export class DataService {
  constructor(
    private apiClient: AxiosInstance,
    private downloadClient: AxiosInstance,
    private toasts: ToastService,
    private geo: GeoService,
    private modals: ModalService,
    private history: HistoryService,
    private readerFactory = defaultReaderFactory
  ) {}

  public listArtefacts(limit = 50, offset = 0): Promise<PaginatedResponse<AbcArtefact>> {
    const params = { limit, offset };
    return this.apiClient
      .get(Api.list(), { params })
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }

  public searchArtefacts(query: string, limit = 50, offset = 0): Promise<PaginatedResponse<AbcArtefact>> {
    const params = { query: encodeURI(query), lang: getLang(), limit, offset };
    return this.apiClient
      .get(Api.search(), { params })
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }

  public downloadFilesFrom(artefact: AbcArtefact): Promise<AbcFile<Blob>[]> {
    const files = artefact.files.map((file) =>
      this.downloadClient
        .get(Api.download(file))
        .then((res) => ({ path: file, content: res.data }))
        .catch((err) => {
          this.toasts.genericError(err);
          return Promise.reject(err);
        })
    );
    return Promise.all(files);
  }

  public downloadLicense(artefact: AbcArtefact): Promise<string> {
    return this.downloadClient
      .get(Api.download(artefact.license))
      .then((res) => BlobIO.asString(res.data))
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }

  public async importArtefact(artefact: AbcArtefact): Promise<ImportResult> {
    const files = await this.downloadFilesFrom(artefact);
    return this.importFiles(files);
  }

  public async importFiles(files: AbcFile<Blob>[]): Promise<ImportResult> {
    // We check if files are not too big
    const bigFiles = files.filter((f) => f.content.size >= MAX_RECOMMENDED_SIZE);
    if (bigFiles.length && (await this.modals.dataSizeWarning()) === ModalStatus.Canceled) {
      return { status: ImportStatus.Canceled };
    }

    // We read files
    const map = this.geo.getMainMap();
    const layers = await this.readerFactory().read(files, map.getProjection());
    if (!layers.length) {
      return { status: ImportStatus.Failed };
    }

    // We check if layers are not too big
    const bigLayers = layers.filter((lay) => lay.isVector() && lay.getSource().getFeatures().length > MAX_RECOMMENDED_FEATURES);
    if (!bigFiles.length && bigLayers.length && (await this.modals.dataSizeWarning()) === ModalStatus.Canceled) {
      return { status: ImportStatus.Canceled };
    }

    // We add layers
    const hour = DateTime.local().toFormat('HH:mm');
    layers.forEach((lay, i) => lay.setName(t('Import_of', { hour, n: i + 1 })));

    const cs = new AddLayersChangeset(map, layers);
    await cs.apply();
    this.history.register(HistoryKey.Map, cs);

    // We set last one active
    const last = layers[layers.length - 1];
    map.setActiveLayer(last);

    // We fit view on last one
    const extent = last.unwrap().getExtent();
    if (extent && getArea(extent)) {
      map.unwrap().getView().fit(extent);
    }

    return { status: ImportStatus.Succeed };
  }
}
