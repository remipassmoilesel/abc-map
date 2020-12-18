import axios, { AxiosError, AxiosInstance } from 'axios';
import mainStore from '../store';
import { AuthenticationActions } from '../store/authentication/actions';

export function httpApiClient(timeout: number): AxiosInstance {
  const client = axios.create({
    baseURL: '/api',
    timeout,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use((config) => {
    const token = mainStore.getState().authentication.tokenString;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        mainStore.dispatch(AuthenticationActions.logout());
      }
      return Promise.reject(error);
    }
  );

  return client;
}
