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
import { AbcArtefact, AbcFile, ArtefactFilter, BlobIO, Logger, PaginatedResponse } from '@abc-map/shared';
import { DatastoreRoutes as Api } from '../http/ApiRoutes';
import { ToastService } from '../ui/ToastService';
import { getLang } from '../../i18n/i18n';
import { ApiClient, DownloadClient } from '../http/http-clients';

const logger = Logger.get('DataStoreService.ts');

export class DataStoreService {
  public static create(toasts: ToastService): DataStoreService {
    return new DataStoreService(ApiClient, DownloadClient, toasts);
  }

  constructor(private apiClient: AxiosInstance, private downloadClient: AxiosInstance, private toasts: ToastService) {}

  public listArtefacts(filter: ArtefactFilter, limit = 50, offset = 0): Promise<PaginatedResponse<AbcArtefact>> {
    const params = { limit, offset, filter };
    return this.apiClient
      .get(Api.list(), { params })
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }

  public searchArtefacts(query: string, filter: ArtefactFilter, limit = 50, offset = 0): Promise<PaginatedResponse<AbcArtefact>> {
    const params = { query: encodeURI(query), lang: getLang(), limit, offset, filter };
    return this.apiClient
      .get(Api.search(), { params })
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }

  public downloadFilesFrom(artefact: AbcArtefact): Promise<AbcFile<Blob>[]> {
    if (!artefact.files?.length) {
      return Promise.resolve([]);
    }

    const files = artefact.files.map((file) => this.downloadFile(file));
    return Promise.all(files);
  }

  public downloadFile(path: string): Promise<AbcFile<Blob>> {
    return this.downloadClient.get(Api.download(path)).then((res) => ({ path, content: res.data }));
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
}
