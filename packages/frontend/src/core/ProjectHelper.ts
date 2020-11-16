import { Project } from '@abc-map/shared-entities';
import * as uuid from 'uuid';
import { DateTime } from 'luxon';

export class ProjectHelper {
  public static emptyProject(): Project {
    return {
      id: uuid.v4(),
      name: `Projet du ${DateTime.local().toLocaleString()}`,
      layers: [],
      createdAt: DateTime.utc().toISO(),
    };
  }
}
