import * as sinon from 'sinon';
import { ProjectService } from '../project/ProjectService';
import { GeoService } from '../geo/GeoService';
import { ToastService } from '../ui/ToastService';
import { ModalService } from '../ui/ModalService';
import { AuthenticationService } from '../authentication/AuthenticationService';
import { HistoryService } from '../history/HistoryService';
import { DataStoreService } from '../data/DataStoreService';
import { VoteService } from '../vote/VoteService';
import { SinonStubbedInstance } from 'sinon';
import { Services } from '../Services';

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
  dataStore: SinonStubbedInstance<DataStoreService>;
  vote: SinonStubbedInstance<VoteService>;
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
    dataStore: sinon.createStubInstance(DataStoreService),
    vote: sinon.createStubInstance(VoteService),
  };
  return services;
}
