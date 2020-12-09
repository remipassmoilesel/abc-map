import { ProjectService } from './project/ProjectService';
import mainStore from './store';
import { MapService } from './map/MapService';
import { ToastService } from './ui/ToastService';

export interface Services {
  project: ProjectService;
  map: MapService;
  toasts: ToastService;
}

let instance: Services | undefined;
export function services(): Services {
  if (!instance) {
    instance = {
      project: new ProjectService(mainStore),
      map: new MapService(),
      toasts: new ToastService(),
    };
  }
  return instance;
}
