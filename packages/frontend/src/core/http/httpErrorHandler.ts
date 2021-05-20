import { AxiosError } from 'axios';
import { ToastService } from '../ui/ToastService';
import { HttpError } from './HttpError';

export function httpErrorHandler(toasts: ToastService, err: AxiosError | Error | undefined): Promise<unknown> {
  if (HttpError.isForbidden(err)) {
    toasts.error('Cette opération est interdite.');
  }

  if (HttpError.isTooManyRequests(err)) {
    const reset = err.response?.headers['x-ratelimit-reset'] || 0;
    if (reset) {
      toasts.error(`Vous avez dépassé le nombre de demandes autorisés, veuillez réessayer dans ${Math.round(reset / 60)} minute(s).`);
    } else {
      toasts.error('Vous avez dépassé le nombre de demandes autorisés, veuillez réessayer plus tard.');
    }
  }

  return Promise.reject(err || new Error('HTTP error'));
}
