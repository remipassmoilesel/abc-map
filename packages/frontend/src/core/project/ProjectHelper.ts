import { AbcProject, DEFAULT_PROJECTION } from '@abc-map/shared-entities';
import * as uuid from 'uuid';
import { DateTime } from 'luxon';

export class ProjectHelper {
  /**
   * Create a new project, with one OSM layer
   */
  public static newProject(): AbcProject {
    return {
      id: uuid.v4(),
      projection: DEFAULT_PROJECTION,
      name: `Projet du ${DateTime.local().toLocaleString()}`,
      layers: [],
    };
  }
}
