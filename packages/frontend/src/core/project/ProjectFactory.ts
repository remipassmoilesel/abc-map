import { AbcProject, AbcProjectMetadata, CURRENT_VERSION, DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import uuid from 'uuid-random';
import { DateTime } from 'luxon';

export class ProjectFactory {
  public static newProjectMetadata(): AbcProjectMetadata {
    return {
      id: uuid(),
      version: CURRENT_VERSION,
      projection: DEFAULT_PROJECTION,
      name: `Projet du ${DateTime.local().toLocaleString()}`,
    };
  }

  public static newProject(): AbcProject {
    return {
      metadata: ProjectFactory.newProjectMetadata(),
      layers: [],
      layouts: [],
    };
  }
}
