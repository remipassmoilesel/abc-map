import { AbcProject, DEFAULT_PROJECTION, LayerType, PredefinedLayerModel } from '@abc-map/shared-entities';
import * as uuid from 'uuid';
import { ObjectID } from 'mongodb';

export class TestHelper {
  public static sampleProject(): AbcProject {
    return {
      id: new ObjectID().toHexString(),
      name: `Test project ${uuid.v4()}`,
      projection: DEFAULT_PROJECTION,
      layers: [
        {
          type: LayerType.Predefined,
          metadata: {
            id: uuid.v4(),
            name: 'OSM Layer',
            visible: true,
            opacity: 1,
          },
          model: PredefinedLayerModel.OSM,
        },
        {
          type: LayerType.Vector,
          metadata: {
            id: uuid.v4(),
            name: 'OSM Layer',
            visible: true,
            opacity: 1,
          },
          features: {
            type: 'FeatureCollection',
            features: [
              {
                id: uuid.v4(),
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
    };
  }
}
