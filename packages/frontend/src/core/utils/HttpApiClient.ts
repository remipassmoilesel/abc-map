import axios, { AxiosInstance } from 'axios';

export function httpApiClient(timeout: number): AxiosInstance {
  return axios.create({
    baseURL: '/api',
    timeout,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}
