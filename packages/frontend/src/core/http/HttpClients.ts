import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import mainStore from '../store';
import { Logger } from '../utils/Logger';

const logger = Logger.get('HttpClients.ts');

/**
 * This client is configured for JSON requests and responses
 * @param timeout
 */
export function httpApiClient(timeout: number): AxiosInstance {
  const client = axios.create({
    baseURL: '/api',
    timeout,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(requestInterceptor);
  client.interceptors.response.use((response) => response, responseInterceptor);

  return client;
}

/**
 * This client is configured for raw responses
 * @param timeout
 */
export function httpDownloadClient(timeout: number): AxiosInstance {
  const client = axios.create({
    baseURL: '/api',
    timeout,
    responseType: 'blob',
    transformResponse: (data) => data,
  });

  client.interceptors.request.use(requestInterceptor);
  client.interceptors.response.use((response) => response, responseInterceptor);

  return client;
}

function requestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  const token = mainStore.getState().authentication.tokenString;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}

function responseInterceptor(error: AxiosError): Promise<any> {
  if (error.response?.status === 401) {
    // TODO: handle expired token
  }
  return Promise.reject(error);
}
