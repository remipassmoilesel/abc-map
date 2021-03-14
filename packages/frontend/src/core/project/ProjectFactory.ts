import { AbcProject, AbcProjectMetadata, CurrentVersion, DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import uuid from 'uuid-random';
import { DateTime } from 'luxon';

export class ProjectFactory {
  public static newProjectMetadata(): AbcProjectMetadata {
    return {
      id: uuid(),
      version: CurrentVersion,
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
