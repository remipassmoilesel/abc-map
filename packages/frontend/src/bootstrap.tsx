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
import { Services } from './core/Services';
import { Logger } from '@abc-map/shared';
import { AxiosError } from 'axios';
import { HttpError } from './core/http/HttpError';
import { BUILD_INFO } from './build-version';
import { render } from './render';
import { MainStore } from './core/store/store';
import { solvesInAtLeast } from './core/utils/solvesInAtLeast';

export const logger = Logger.get('bootstrap.tsx', 'warn');

export function bootstrap(svc: Services, store: MainStore) {
  logger.info('Version: ', BUILD_INFO);

  return solvesInAtLeast(authentication(svc), 900)
    .then(() => render(svc, store))
    .then(() => svc.project.newProject())
    .catch((err) => bootstrapError(err));
}

/**
 * All users are authenticated, as connected users or as anonymous users
 * @param svc
 */
function authentication(svc: Services): Promise<void> {
  // If we are connected or connected as anonymous we try to renew token
  const connected = !!svc.authentication.getUserStatus();
  if (connected) {
    return svc.authentication.renewToken().catch((err) => {
      logger.error('Cannot renew token: ', err);
      return svc.authentication.anonymousLogin();
    });
  }
  // Else we authenticate as anonymous
  else {
    return svc.authentication.anonymousLogin();
  }
}

function bootstrapError(err: Error | AxiosError | undefined): void {
  logger.error('Bootstrap error: ', err);

  let message: string;
  if (HttpError.isTooManyRequests(err)) {
    message = 'You have exceeded the number of authorized requests 😭. Please try again later.';
  } else {
    message = 'Small technical issue 😅 Please try again later.';
  }

  const root = document.querySelector('#root');
  if (!root) {
    alert(message);
    return;
  }

  root.innerHTML = `
    <h1 class='text-center my-5'>Abc-Map</h1>
    <h5 class='text-center my-5'>${message}</h5>
  `;
}
