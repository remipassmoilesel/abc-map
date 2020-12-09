import { ProjectService } from './project/ProjectService';
import mainStore from '../store';
import { MapService } from './map/MapService';

export interface Services {
  project: ProjectService;
  map: MapService;
}

let instance: Services | undefined;
export function services(): Services {
  if (!instance) {
    instance = {
      project: new ProjectService(mainStore),
      map: new MapService(),
    };
  }
  return instance;
}
