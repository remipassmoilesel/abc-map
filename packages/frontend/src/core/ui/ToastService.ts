/**
 * Copyright © 2021 Rémi Pace.
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

import { toast } from 'react-toastify';
import { ToastOptions } from 'react-toastify/dist/types';
import { AxiosError } from 'axios';
import { HttpError } from '../http/HttpError';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('ToastService');

const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5_000,
  pauseOnFocusLoss: true,
  hideProgressBar: true,
  className: 'abc-toast',
};

export class ToastService {
  public info(message: string): void {
    const options = { ...defaultOptions };
    options.toastId = message;
    toast.info(message, options);
  }

  public error(message: string): void {
    const options = { ...defaultOptions };
    options.toastId = message;
    toast.error(message, options);
  }

  public genericError(): void {
    this.error('Une erreur est survenue, veuillez réessayer plus tard.');
  }

  public featureNotReady(): void {
    this.info("Cette fonctionnalité n'est pas encore disponible");
  }

  public httpError(err: AxiosError | Error | undefined): void {
    logger.error('HTTP error: ', JSON.stringify(err));

    // Too many requests
    if (HttpError.isTooManyRequests(err)) {
      const reset = err.response?.headers['x-ratelimit-reset'] || 0;
      if (reset) {
        this.error(`Vous avez dépassé le nombre de demandes autorisés, veuillez réessayer dans ${Math.round(reset / 60)} minute(s).`);
      } else {
        this.error('Vous avez dépassé le nombre de demandes autorisés, veuillez réessayer plus tard.');
      }
    }

    // Forbidden
    else if (HttpError.isForbidden(err)) {
      this.error('Cette opération est interdite.');
    }

    // Unauthorized
    else if (HttpError.isUnauthorized(err)) {
      this.error('Vous devez être connecté pour effectuer cette opération.');
    }

    // Network error
    else if (err?.message === 'Network Error') {
      this.error('Il y a un problème avec votre connexion internet.');
    }

    // Others
    else {
      this.genericError();
    }
  }
}
