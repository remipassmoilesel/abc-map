/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import {
  AbcArtefact,
  AbcProjectManifest,
  AbcUser,
  CompressedProject,
  DEFAULT_PROJECTION,
  LayerType,
  LegendDisplay,
  NodeBinary,
  PredefinedLayerModel,
  ProjectConstants,
  Zipper,
} from '@abc-map/shared';
import * as uuid from 'uuid-random';
import { ProjectDocument } from '../projects/ProjectDocument';
import { DateTime } from 'luxon';

export class TestHelper {
  public static sampleUser(): AbcUser {
    return {
      id: uuid(),
      email: `user-${uuid()}@test.ts`,
      password: 'what is a wr0ng passW0rd ????',
    };
  }

  public static sampleProject(): AbcProjectManifest {
    return {
      metadata: {
        id: uuid(),
        version: ProjectConstants.CurrentVersion,
        name: `Test project ${uuid()}`,
        projection: DEFAULT_PROJECTION,
        containsCredentials: false,
      },
      layers: [
        {
          type: LayerType.Predefined,
          metadata: {
            id: uuid(),
            name: 'OpenStreetMap',
            type: LayerType.Predefined,
            visible: true,
            active: false,
            opacity: 1,
            model: PredefinedLayerModel.OSM,
          },
        },
        {
          type: LayerType.Vector,
          metadata: {
            id: uuid(),
            name: 'Vecteurs',
            type: LayerType.Vector,
            visible: true,
            active: true,
            opacity: 1,
          },
          features: {
            type: 'FeatureCollection',
            features: [
              {
                id: uuid(),
                bbox: [1, 2, 3, 4],
                type: 'Feature',
                properties: {
                  val: 'var',
                },
                geometry: {
                  type: 'Point',
                  coordinates: [1, 5],
                },
              },
            ],
          },
        },
      ],
      layouts: [],
      legend: {
        display: LegendDisplay.Hidden,
        items: [],
        width: 300,
        height: 500,
      },
      view: {
        center: [1, 2],
        projection: DEFAULT_PROJECTION,
        resolution: 1000,
      },
    };
  }

  public static async sampleCompressedProject(): Promise<CompressedProject<NodeBinary>> {
    const project = this.sampleProject();
    const metadata = project.metadata;
    const zip = await Zipper.forBackend().zipFiles([{ path: ProjectConstants.ManifestName, content: Buffer.from(JSON.stringify(project), 'utf-8') }]);
    return {
      metadata: metadata,
      project: zip,
    };
  }

  public static sampleProjectDocument(): ProjectDocument {
    return {
      _id: uuid(),
      ownerId: uuid(),
      containsCredentials: false,
      name: 'Fake project',
      projection: { name: 'EPSG:4326' },
      version: '0.1',
    };
  }

  public static sampleArtefact(): AbcArtefact {
    return {
      id: uuid(),
      name: 'Burgers around the world',
      license: 'AGPLv3',
      description: 'A beautiful artefact',
      files: ['file1.gpx', 'file2.shp'],
      path: '/datastore/artefact',
      keywords: ['beautiful', 'artifact'],
    };
  }

  public static randomDate(start: Date = new Date(1980, 1, 1, 0, 0, 0), end: Date = new Date(2020, 1, 1, 0, 0, 0)): DateTime {
    const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return DateTime.fromMillis(timestamp);
  }

  /**
   * Warning: use this is a very bad idea
   */
  public static wait(timeMs: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, timeMs);
    });
  }
}
