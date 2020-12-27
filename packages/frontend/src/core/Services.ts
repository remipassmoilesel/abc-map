import { ProjectService } from './project/ProjectService';
import mainStore from './store';
import { MapService } from './map/MapService';
import { ToastService } from './ui/ToastService';
import { httpApiClient, httpDownloadClient } from './http/HttpClients';
import { AuthenticationService } from './authentication/AuthenticationService';
import { HistoryService } from './history/HistoryService';
import { DatastoreService } from './datastore/DatastoreService';

export interface Services {
  project: ProjectService;
  map: MapService;
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
  const mapService = new MapService(mainStore);
  const projectService = new ProjectService(apiClient, mainStore, mapService);
  const authenticationService = new AuthenticationService(apiClient, mainStore);
  const historyService = HistoryService.create();
  const dataStoreService = new DatastoreService(apiClient, downloadClient);

  return {
    project: projectService,
    map: mapService,
    toasts: toastsService,
    authentication: authenticationService,
    history: historyService,
    dataStore: dataStoreService,
  };
}
