import { ProjectService } from './project/ProjectService';
import { GeoService } from './map/GeoService';
import { ToastService } from './ui/ToastService';
import { httpApiClient, httpDownloadClient } from './http/HttpClients';
import { AuthenticationService } from './authentication/AuthenticationService';
import { HistoryService } from './history/HistoryService';
import { DatastoreService } from './datastore/DatastoreService';
import { mainStore } from './store/store';

export interface Services {
  project: ProjectService;
  geo: GeoService;
  toasts: ToastService;
  authentication: AuthenticationService;
  history: HistoryService;
  dataStore: DatastoreService;
}

let instance: Services | undefined;
export function services(): Services {
  if (!instance) {
    instance = serviceFactory();
  }
  return instance;
}

function serviceFactory(): Services {
  const apiClient = httpApiClient(5_000);
  const downloadClient = httpDownloadClient(5_000);

  const toastsService = new ToastService();
  const geoService = new GeoService();
  const projectService = new ProjectService(apiClient, mainStore, geoService);
  const authenticationService = new AuthenticationService(apiClient, mainStore);
  const historyService = HistoryService.create();
  const dataStoreService = new DatastoreService(apiClient, downloadClient);

  return {
    project: projectService,
    geo: geoService,
    toasts: toastsService,
    authentication: authenticationService,
    history: historyService,
    dataStore: dataStoreService,
  };
}
