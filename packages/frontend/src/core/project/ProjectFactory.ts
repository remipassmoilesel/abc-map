import { AbcProject, CURRENT_VERSION, DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import * as uuid from 'uuid';
import { DateTime } from 'luxon';

export class ProjectFactory {
  /**
   * Create a new project, with one OSM layer
   */
  public static newProject(): AbcProject {
    return {
      metadata: {
        id: uuid.v4(),
        version: CURRENT_VERSION,
        projection: DEFAULT_PROJECTION,
        name: `Projet du ${DateTime.local().toLocaleString()}`,
      },
      layers: [],
      layouts: [],
    };
  }
}
