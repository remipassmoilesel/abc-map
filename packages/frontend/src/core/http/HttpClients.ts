import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Logger } from '@abc-map/frontend-shared';
import { mainStore } from '../store/store';

const logger = Logger.get('HttpClients.ts');

export declare type HttpErrorHandler = (e: AxiosError) => void;

/**
 * This client is configured for JSON requests and responses
 * @param timeout
 */
export function httpApiClient(timeout: number, errorHandler: HttpErrorHandler): AxiosInstance {
  const client = axios.create({
    baseURL: '/api',
    timeout,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(authenticationInterceptor);
  client.interceptors.response.use((response) => response, errorHandler);

  return client;
}

/**
 * This client is configured for raw responses
 * @param timeout
 */
export function httpDownloadClient(timeout: number, errorHandler: HttpErrorHandler): AxiosInstance {
  const client = axios.create({
    baseURL: '/api',
    timeout,
    responseType: 'blob',
    transformResponse: (data) => data,
  });

  client.interceptors.request.use(authenticationInterceptor);
  client.interceptors.response.use((response) => response, errorHandler);

  return client;
}

/**
 * Only timeout is set on this client, useful for requests to external services.
 * @param timeout
 */
export function httpExternalClient(timeout: number): AxiosInstance {
  return axios.create({
    timeout,
  });
}

function authenticationInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  const token = mainStore.getState().authentication.tokenString;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}
