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
import { ApiClient } from '../http/http-clients';
import { GetPointIconsRequest, GetPointIconsResponse, Logger } from '@abc-map/shared';
import { PointIconsRoutes } from '../http/ApiRoutes';
import { AllPointIcons, PointIcon } from '@abc-map/point-icons';
import axiosRetry from 'axios-retry';

const logger = Logger.get('PointIconsApiClient.ts');

export class PointIconsApiClient {
  public static create() {
    return new PointIconsApiClient(ApiClient());
  }

  constructor(private apiClient: AxiosInstance) {
    axiosRetry(this.apiClient, {
      retries: 3,
      retryCondition: (err) => err.response?.status !== 200,
      retryDelay: (retryCount) => Math.min(1000, retryCount * 300),
    });
  }

  public async getIcons(names: string[]): Promise<{ icon: PointIcon; content: string }[]> {
    const request: GetPointIconsRequest = { names };
    const response = await this.apiClient.post(PointIconsRoutes.getIcons(), request);
    const body = response.data as GetPointIconsResponse | undefined;

    const icons = body?.icons || [];
    return icons
      .map(({ name, content }) => {
        const icon = AllPointIcons.find((icon_1) => icon_1.name === name);
        if (!icon) {
          logger.error('Invalid icon: ', name);
          return null;
        }
        return { icon, content };
      })
      .filter((item): item is { icon: PointIcon; content: string } => !!item);
  }
}
