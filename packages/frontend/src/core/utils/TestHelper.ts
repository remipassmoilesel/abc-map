import { Feature as GeoJsonFeature, GeoJsonProperties, Geometry as GeoJsonGeometry } from 'geojson';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { Point } from 'ol/geom';
import {
  AbcArtefact,
  AbcLayout,
  AbcPredefinedLayer,
  AbcProject,
  AbcVectorLayer,
  AbcWmsLayer,
  CurrentVersion,
  DEFAULT_PROJECTION,
  FillPatterns,
  LayerType,
  LayoutFormats,
  ManifestName,
  PredefinedLayerModel,
} from '@abc-map/shared-entities';
import uuid from 'uuid-random';
import { FeatureStyle } from '../geo/style/FeatureStyle';
import { CompressedProject } from '../project/CompressedProject';
import { Zipper } from '@abc-map/frontend-shared';
import { PointIcons } from '../geo/style/PointIcons';

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
        id: uuid(),
        version: CurrentVersion,
        name: `Test project ${uuid()}`,
        projection: DEFAULT_PROJECTION,
        containsCredentials: false,
      },
      layers: [this.sampleOsmLayer(), this.sampleVectorLayer()],
      layouts: [],
    };
  }

  public static async sampleCompressedProject(): Promise<CompressedProject> {
    const project = this.sampleProject();
    const metadata = project.metadata;
    const zip = await Zipper.zipFiles([{ path: ManifestName, content: new Blob([JSON.stringify(project)]) }]);
    return {
      metadata: metadata,
      project: zip,
    };
  }

  public static sampleVectorLayer(): AbcVectorLayer {
    return {
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
    };
  }

  public static sampleGeojsonFeature(): GeoJsonFeature<GeoJsonGeometry, GeoJsonProperties> {
    return {
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
    };
  }

  public static sampleWmsLayer(): AbcWmsLayer {
    return {
      type: LayerType.Wms,
      metadata: {
        id: uuid(),
        name: 'Couche WMS',
        type: LayerType.Wms,
        visible: true,
        active: true,
        opacity: 1,
        remoteUrl: 'http://remote-url',
        remoteLayerName: 'test-layer-name',
        projection: {
          name: 'EPSG:4326',
        },
        extent: [1, 2, 3, 4],
        auth: {
          username: 'test-username',
          password: 'test-password',
        },
      },
    };
  }

  public static sampleOsmLayer(): AbcPredefinedLayer {
    return {
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
    };
  }

  public static sampleArtefact(): AbcArtefact {
    return {
      id: uuid(),
      path: '/sample/manifest.yaml',
      name: 'Sample artefact',
      files: ['file/1.gpx', 'file/2.kml'],
      link: 'http://somewhere',
      license: 'LICENSE.txt',
      keywords: ['gpx', 'kml'],
      description: 'A sample artefact',
    };
  }

  public static sampleLayout(): AbcLayout {
    return {
      id: uuid(),
      name: 'Sample layout',
      format: LayoutFormats.A4_PORTRAIT,
      view: {
        center: [1.5, 45.4],
        resolution: 1000,
        projection: DEFAULT_PROJECTION,
      },
    };
  }

  /**
   * Warning: use this is generally a very bad idea
   */
  public static wait(timeMs: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, timeMs);
    });
  }

  public static sampleStyleProperties(): FeatureStyle {
    return {
      stroke: {
        width: 5,
        color: 'black',
      },
      fill: {
        color1: 'white',
        color2: 'blue',
        pattern: FillPatterns.HatchingObliqueLeft,
      },
      text: {
        value: 'Test text value',
        color: '#00f',
        size: 30,
        font: 'sans-serif',
        offsetX: 20,
        offsetY: 30,
        alignment: 'left',
      },
      point: {
        icon: PointIcons.Star,
        size: 5,
      },
    };
  }
}
