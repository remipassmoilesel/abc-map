import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { Point } from 'ol/geom';
import { AbcPredefinedLayer, AbcProject, AbcVectorLayer, CURRENT_VERSION, DEFAULT_PROJECTION, LayerType, PredefinedLayerModel } from '@abc-map/shared-entities';
import * as uuid from 'uuid';

export class TestHelper {
  public static samplePointFeature(): Feature<Geometry> {
    const feature = new Feature<Geometry>();
    feature.setGeometry(new Point([1, 2]));
    feature.setProperties({ prop1: 'value1', prop2: 'value2' });
    return feature;
  }

  public static sampleFeatures(): Feature<Geometry>[] {
    return [this.samplePointFeature(), this.samplePointFeature(), this.samplePointFeature()];
  }

  public static sampleProject(): AbcProject {
    return {
      metadata: {
        id: uuid.v4(),
        version: CURRENT_VERSION,
        name: `Test project ${uuid.v4()}`,
        projection: DEFAULT_PROJECTION,
      },
      layers: [this.sampleOsmLayer(), this.sampleVectorLayer()],
    };
  }

  public static sampleVectorLayer(): AbcVectorLayer {
    return {
      type: LayerType.Vector,
      metadata: {
        id: uuid.v4(),
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
    };
  }

  public static sampleOsmLayer(): AbcPredefinedLayer {
    return {
      type: LayerType.Predefined,
      metadata: {
        id: uuid.v4(),
        name: 'OpenStreetMap',
        type: LayerType.Predefined,
        visible: true,
        active: false,
        opacity: 1,
      },
      model: PredefinedLayerModel.OSM,
    };
  }
}
