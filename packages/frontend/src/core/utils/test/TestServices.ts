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

import * as sinon from 'sinon';
import { ProjectService } from '../../project/ProjectService';
import { GeoService } from '../../geo/GeoService';
import { ToastService } from '../../ui/ToastService';
import { ModalService } from '../../ui/ModalService';
import { AuthenticationService } from '../../authentication/AuthenticationService';
import { HistoryService } from '../../history/HistoryService';
import { DataService } from '../../data/DataService';
import { VoteService } from '../../vote/VoteService';
import { SinonStubbedInstance } from 'sinon';
import { Services } from '../../Services';
import { LegalMentionsService } from '../../legal-mentions/LegalMentionsService';
import { LocalStorageService } from '../../local-storage/LocalStorageService';

type SameKeys<T> = {
  [P in keyof T]: SinonStubbedInstance<any>;
};

export interface TestServices {
  project: SinonStubbedInstance<ProjectService>;
  geo: SinonStubbedInstance<GeoService>;
  toasts: SinonStubbedInstance<ToastService>;
  modals: SinonStubbedInstance<ModalService>;
  authentication: SinonStubbedInstance<AuthenticationService>;
  history: SinonStubbedInstance<HistoryService>;
  data: SinonStubbedInstance<DataService>;
  vote: SinonStubbedInstance<VoteService>;
  legalMentions: SinonStubbedInstance<LegalMentionsService>;
  storage: SinonStubbedInstance<LocalStorageService>;
}

export function newTestServices(): TestServices {
  // SameKeys<Services> check compatibility with Services
  const services: SameKeys<Services> = {
    project: sinon.createStubInstance(ProjectService),
    geo: sinon.createStubInstance(GeoService),
    toasts: sinon.createStubInstance(ToastService),
    modals: sinon.createStubInstance(ModalService),
    authentication: sinon.createStubInstance(AuthenticationService),
    history: sinon.createStubInstance(HistoryService),
    data: sinon.createStubInstance(DataService),
    vote: sinon.createStubInstance(VoteService),
    legalMentions: sinon.createStubInstance(LegalMentionsService),
    storage: sinon.createStubInstance(LocalStorageService),
  };
  return services;
}
