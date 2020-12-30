import { AbcProject, AbcProjectMetadata, CURRENT_VERSION, DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import * as uuid from 'uuid';
import { DateTime } from 'luxon';

export class ProjectFactory {
  public static newProjectMetadata(): AbcProjectMetadata {
    return {
      id: uuid.v4(),
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
