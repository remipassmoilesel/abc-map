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
import { httpApiClient, httpDownloadClient, httpExternalClient } from './http/http-clients';
import { AuthenticationService } from './authentication/AuthenticationService';
import { HistoryService } from './history/HistoryService';
import { DataStoreService } from './data/DataStoreService';
import { MainStore, mainStore } from './store/store';
import { ToastService } from './ui/ToastService';
import { ModalService } from './ui/ModalService';
import { FeedbackService } from './feedback/FeedbackService';
import { LegalMentionsService } from './legal-mentions/LegalMentionsService';
import { getAbcWindow, Logger } from '@abc-map/shared';
import { LocalStorageService } from './local-storage/LocalStorageService';

const logger = Logger.get('Services.ts');

export interface Services {
  project: ProjectService;
  geo: GeoService;
  toasts: ToastService;
  modals: ModalService;
  authentication: AuthenticationService;
  history: HistoryService;
  dataStore: DataStoreService;
  feedback: FeedbackService;
  legalMentions: LegalMentionsService;
  storage: LocalStorageService;
}

export function getServices(): Services {
  const window = getAbcWindow();
  if (!window.abc.services) {
    window.abc.services = servicesFactory(mainStore);
  }

  return getAbcWindow().abc.services;
}

export function servicesFactory(store: MainStore): Services {
  const apiClient = httpApiClient(5_000);
  const downloadClient = httpDownloadClient(40_000);
  const capabilitiesClient = httpExternalClient(20_000);

  const toasts = new ToastService();
  const modals = new ModalService();
  const history = HistoryService.create(store);
  const geo = new GeoService(apiClient, capabilitiesClient, toasts, history, store);
  const project = ProjectService.create(apiClient, downloadClient, store, toasts, geo, modals);
  const authentication = new AuthenticationService(apiClient, store);
  const dataStore = new DataStoreService(apiClient, downloadClient, toasts);
  const feedback = new FeedbackService(apiClient, toasts);
  const legalMentions = new LegalMentionsService(downloadClient, toasts);
  const storage = new LocalStorageService();

  authentication.addDisconnectListener(() => project.resetCache());

  return {
    project,
    geo,
    modals,
    toasts,
    authentication,
    history,
    dataStore,
    feedback,
    legalMentions,
    storage,
  };
}
