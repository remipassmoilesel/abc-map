import { AbcProject, CURRENT_VERSION, DEFAULT_PROJECTION, LayerType, PredefinedLayerModel } from '@abc-map/shared-entities';
import * as uuid from 'uuid-random';
import { AbcUser } from '@abc-map/shared-entities';

export class TestHelper {
  public static sampleProject(): AbcProject {
    return {
      metadata: {
        id: uuid(),
        version: CURRENT_VERSION,
        name: `Test project ${uuid()}`,
        projection: DEFAULT_PROJECTION,
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
    };
  }

  public static sampleUser(): AbcUser {
    return {
      id: uuid(),
      email: `user-${uuid()}@test.ts`,
      password: 'what is wr0ng passW0rd ????',
      enabled: true,
    };
  }
}
