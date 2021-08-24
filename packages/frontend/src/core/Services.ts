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
import { DataService } from './data/DataService';
import { MainStore, mainStore } from './store/store';
import { ToastService } from './ui/ToastService';
import { ModalService } from './ui/ModalService';
import { VoteService } from './vote/VoteService';
import { StyleFactory } from './geo/styles/StyleFactory';
import { LegalMentionsService } from './legal-mentions/LegalMentionsService';
import { ProjectEventType } from './project/ProjectEvent';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('Services.ts');

export interface Services {
  project: ProjectService;
  geo: GeoService;
  toasts: ToastService;
  modals: ModalService;
  authentication: AuthenticationService;
  history: HistoryService;
  data: DataService;
  vote: VoteService;
  legalMentions: LegalMentionsService;
}

let instance: Services | undefined;
export function getServices(): Services {
  if (!instance) {
    instance = servicesFactory(mainStore);
  }
  return instance;
}

export function servicesFactory(store: MainStore): Services {
  const jsonClient = httpApiClient(5_000);
  const downloadClient = httpDownloadClient(5_000);
  const externalClient = httpExternalClient(5_000);

  const toasts = new ToastService();
  const modals = new ModalService();
  const history = HistoryService.create();
  const geo = new GeoService(externalClient, toasts, history, store);
  const project = new ProjectService(jsonClient, downloadClient, store, toasts, geo, modals);
  const authentication = new AuthenticationService(jsonClient, store, toasts);
  const data = new DataService(jsonClient, downloadClient, toasts, geo, modals, history);
  const vote = new VoteService(jsonClient, toasts);
  const legalMentions = new LegalMentionsService(downloadClient, toasts);

  // Here we can listen to project changes for global actions
  project.addEventListener((ev) => {
    if (ProjectEventType.ProjectLoaded === ev.type) {
      history.resetHistory();
      StyleFactory.get().clearCache();
    } else {
      logger.error('Unhandled event type: ', ev);
    }
  });

  return {
    project,
    geo,
    modals,
    toasts,
    authentication,
    history,
    data,
    vote,
    legalMentions,
  };
}
