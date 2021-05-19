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

import { ProjectService } from './project/ProjectService';
import { GeoService } from './geo/GeoService';
import { httpExternalClient, httpApiClient, httpDownloadClient } from './http/HttpClients';
import { AuthenticationService } from './authentication/AuthenticationService';
import { HistoryService } from './history/HistoryService';
import { DataStoreService } from './data/DataStoreService';
import { mainStore } from './store/store';
import { ToastService } from './ui/ToastService';
import { ModalService } from './ui/ModalService';
import { AxiosError } from 'axios';
import { VoteService } from './vote/VoteService';
import { HttpError } from './utils/HttpError';

export interface Services {
  project: ProjectService;
  geo: GeoService;
  toasts: ToastService;
  modals: ModalService;
  authentication: AuthenticationService;
  history: HistoryService;
  dataStore: DataStoreService;
  vote: VoteService;
}

let instance: Services | undefined;
export function getServices(): Services {
  if (!instance) {
    instance = serviceFactory();
  }
  return instance;
}

function serviceFactory(): Services {
  const toasts = new ToastService();

  const jsonClient = httpApiClient(5_000, (err) => httpErrorHandler(err, toasts));
  const downloadClient = httpDownloadClient(5_000, (err) => httpErrorHandler(err, toasts));
  const externalClient = httpExternalClient(5_000);

  const modals = new ModalService();
  const history = HistoryService.create();
  const geo = new GeoService(externalClient, history);
  const project = new ProjectService(jsonClient, downloadClient, mainStore, geo);
  const authentication = new AuthenticationService(jsonClient, mainStore, toasts);
  const dataStore = new DataStoreService(jsonClient, downloadClient, geo);
  const vote = new VoteService(jsonClient);

  return {
    project,
    geo,
    modals,
    toasts,
    authentication,
    history,
    dataStore,
    vote,
  };
}

function httpErrorHandler(err: AxiosError | undefined, toasts: ToastService) {
  if (HttpError.isForbidden(err)) {
    toasts.error('Cette opération est interdite.');
  }
  if (HttpError.isTooManyRequests(err)) {
    toasts.error('Vous avez dépassé le nombre de demandes autorisés, veuillez réessayer plus tard');
  }

  return Promise.reject(err);
}
