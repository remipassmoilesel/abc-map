import { ProjectService } from './project/ProjectService';
import mainStore from './store';
import { MapService } from './map/MapService';
import { ToastService } from './ui/ToastService';
import { httpApiClient } from './utils/HttpApiClient';

export interface Services {
  project: ProjectService;
  map: MapService;
  toasts: ToastService;
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

  const toasts = new ToastService();
  const mapService = new MapService(mainStore);
  const projectService = new ProjectService(httpClient, mainStore, mapService);

  return {
    project: projectService,
    map: mapService,
    toasts,
  };
}
