import { ProjectService } from './ProjectService';
import mainStore from '../store';

export interface Services {
  project: ProjectService;
}

let instance: Services | undefined;
export function services(): Services {
  if (!instance) {
    instance = {
      project: new ProjectService(mainStore),
    };
  }
  return instance;
}
