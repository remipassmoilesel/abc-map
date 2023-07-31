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
 *
 *
 *
 */

import { DownloadClient } from '../http/http-clients';
import { AxiosInstance } from 'axios';
import { ToastService } from '../ui/ToastService';
import { BlobIO } from '@abc-map/shared';

const NoContent = document.createElement('div');
NoContent.className = 'alert alert-warning mx-5 my-5';
NoContent.innerHTML = 'No content found. This is probably a bug 🐛. If this problem persists, contact the administrator.';

export class DocumentationService {
  public static create(toasts: ToastService) {
    return new DocumentationService(DownloadClient, toasts);
  }

  constructor(private client: AxiosInstance, private toasts: ToastService) {}

  public getContent(route: string): Promise<Element> {
    return this.client
      .get(route)
      .then((res) => BlobIO.asString(res.data))
      .then((content) => {
        const parser = new DOMParser();
        const document = parser.parseFromString(content, 'text/html');
        return document.body.querySelector('#page-content') || NoContent;
      })
      .catch((err) => {
        this.toasts.genericError(err);
        return Promise.reject(err);
      });
  }
}
