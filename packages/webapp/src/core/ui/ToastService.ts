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

import { toast, ToastOptions } from 'react-toastify';
import { AxiosError } from 'axios';
import { HttpError } from '../http/HttpError';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';

const logger = Logger.get('ToastService');

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 7_000,
  pauseOnFocusLoss: true,
  hideProgressBar: true,
  className: 'abc-toast',
  closeOnClick: true,
  rtl: false,
  draggable: true,
  theme: 'colored',
  icon: false,
};

const t = prefixedTranslation('ToastService:');

export class ToastService {
  /**
   * Show toast then return toast id. You can dismiss it with dismiss().
   * @param message
   */
  public info(message: string): string {
    const options = { ...defaultOptions };
    options.toastId = message;
    toast.info(message, options);
    return options.toastId;
  }

  /**
   * Show toast then return toast id. You can dismiss it with dismiss().
   * @param message
   */
  public error(message: string): string {
    const options = { ...defaultOptions };
    options.toastId = message;
    toast.error(message, options);
    return options.toastId;
  }

  /**
   * Show toast then return toast id. You can dismiss it with dismiss().
   */
  public featureNotReady(): string {
    return this.info(t('This_feature_is_not_yet_available'));
  }

  public genericError(err?: AxiosError | Error | unknown): void {
    // Too many requests
    if (HttpError.isTooManyRequests(err)) {
      const reset = parseInt(err.response?.headers['x-ratelimit-reset'] || '0');
      if (reset) {
        const minutes = Math.round(reset / 60);
        this.error(t(`You_have_exceeded_the_number_of_requests_allowed_try_agin_in_XX_min`, { minutes }));
      } else {
        this.error(t('You_have_exceeded_the_number_of_requests_allowed'));
      }
    }

    // Forbidden
    else if (HttpError.isForbidden(err)) {
      this.error(t('Forbidden'));
    }

    // Unauthorized
    else if (HttpError.isUnauthorized(err)) {
      this.error(t('You_must_connect_before'));
    }

    // Network error
    else if (err instanceof Error && 'message' in err && err?.message === 'Network Error') {
      this.error(t('Are_you_connected'));
    }

    // Others
    else {
      this.error(t('Unknown_technical_problem'));
    }
  }

  public tooMuchProjectError() {
    return this.error(t('Too_much_projects'));
  }

  /**
   * Dismiss specified toast. Use id returned by info(), error() ...
   * @param id
   */
  public dismiss(id: string): void {
    toast.dismiss(id);
  }
}
