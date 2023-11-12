/**
 * Copyright © 2023 Rémi Pace.
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
import { ToastService } from '../ui/ToastService';
import { LegalMentionsRoutes as Api } from '../http/ApiRoutes';
import { DownloadClient } from '../http/http-clients';
import { BlobIO } from '@abc-map/shared';

export class LegalMentionsService {
  public static create(toasts: ToastService): LegalMentionsService {
    return new LegalMentionsService(DownloadClient(), toasts);
  }

  constructor(private httpClient: AxiosInstance, private toasts: ToastService) {}

  public get(): Promise<string> {
    return this.httpClient
      .get(Api.legalMentions())
      .then((res) => BlobIO.asString(res.data))
      .then((content) => {
        const parser = new DOMParser();
        const document = parser.parseFromString(content, 'text/html');
        return document.body.innerHTML;
      })
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }
}
