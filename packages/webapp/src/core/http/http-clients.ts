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

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Logger } from '@abc-map/shared';
import { mainStore } from '../store/store';

const logger = Logger.get('HttpClients.ts');

export declare type HttpErrorHandler = (e: AxiosError | undefined) => void;

export const ApiClient = httpApiClient(5_000);
export const DownloadClient = httpDownloadClient(40_000);
export const ExternalClient = httpExternalClient(20_000);

/**
 * This client is configured for JSON requests and responses
 */
export function httpApiClient(timeout: number, errorHandler?: HttpErrorHandler): AxiosInstance {
  const client = axios.create({
    timeout,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(authenticationInterceptor);
  client.interceptors.response.use(undefined, errorHandler);

  return client;
}

/**
 * This client is configured for raw responses, and use server authentication
 */
export function httpDownloadClient(timeout: number, errorHandler?: HttpErrorHandler): AxiosInstance {
  const client = axios.create({
    timeout,
    responseType: 'blob',
  });

  client.interceptors.request.use(authenticationInterceptor);
  client.interceptors.response.use(undefined, errorHandler);

  return client;
}

/**
 * Only timeout is set on this client, useful for requests to external services.
 * @param timeout
 */
export function httpExternalClient(timeout: number): AxiosInstance {
  return axios.create({ timeout });
}

function authenticationInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = mainStore.getState().authentication.tokenString;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}
