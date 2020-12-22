import { ProjectService } from './project/ProjectService';
import mainStore from './store';
import { MapService } from './map/MapService';
import { ToastService } from './ui/ToastService';
import { httpApiClient } from './utils/HttpApiClient';
import { AuthenticationService } from './authentication/AuthenticationService';
import { HistoryService } from './history/HistoryService';

export interface Services {
  project: ProjectService;
  map: MapService;
  toasts: ToastService;
  authentication: AuthenticationService;
  history: HistoryService;
}

let instance: Services | undefined;
export function services(): Services {
  if (!instance) {
    instance = serviceFactory();
  }
  return instance;
}

function serviceFactory(): Services {
  const httpClient = httpApiClient(5_000);

  const toastsService = new ToastService();
  const mapService = new MapService(mainStore);
  const projectService = new ProjectService(httpClient, mainStore, mapService);
  const authenticationService = new AuthenticationService(httpClient, mainStore);
  const historyService = HistoryService.create();

  return {
    project: projectService,
    map: mapService,
    toasts: toastsService,
    authentication: authenticationService,
    history: historyService,
  };
}
