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

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getServices } from './core/Services';
import { E2eMapWrapper } from './core/geo/map/E2eMapWrapper';
import { getAbcWindow, Logger } from '@abc-map/shared';
import { UserStatus } from '@abc-map/shared';
import { mainStore } from './core/store/store';
import { AxiosError } from 'axios';
import { HttpError } from './core/http/HttpError';
import './index.scss';
import { BUILD_INFO } from './build-version';

const logger = Logger.get('index.tsx', 'info');
const svc = getServices();

logger.info('Version: ', BUILD_INFO);

authenticate()
  .then(() => load())
  .catch((err) => {
    logger.error(err);
    loadingError(err);
  });

// TODO: test
async function authenticate(): Promise<void> {
  const isAuthenticated = svc.authentication.getUserStatus() === UserStatus.Authenticated;
  if (isAuthenticated) {
    return svc.authentication.renewToken().catch((err) => {
      svc.toasts.error('Vous devez vous reconnecter');
      logger.error(err);
      return svc.authentication.anonymousLogin();
    });
  } else {
    return svc.authentication.anonymousLogin();
  }
}

function load() {
  // For tests and debug purposes
  const _window = getAbcWindow();
  _window.abc.mainMap = new E2eMapWrapper(svc.geo.getMainMap());
  _window.abc.services = svc;
  _window.abc.store = mainStore;

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

function loadingError(err: Error | AxiosError | undefined): void {
  let message: string;
  if (HttpError.isTooManyRequests(err)) {
    message = 'Vous avez dépassé le nombre de demandes autorisés 😭. Veuillez réessayer plus tard.';
  } else {
    message = 'Une erreur empêche le chargement de la page 😭. Veuillez réessayer plus tard.';
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
