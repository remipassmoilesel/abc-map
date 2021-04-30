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

const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5_000,
  pauseOnFocusLoss: true,
  hideProgressBar: true,
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
}
