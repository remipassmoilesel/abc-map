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

import { Feature as GeoJsonFeature, GeoJsonProperties, Geometry as GeoJsonGeometry } from 'geojson';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { Point } from 'ol/geom';
import {
  AbcArtefact,
  AbcLayout,
  AbcPredefinedLayer,
  AbcProjectManifest,
  AbcVectorLayer,
  AbcWmsLayer,
  AbcXyzLayer,
  CompressedProject,
  DEFAULT_PROJECTION,
  FillPatterns,
  LayerType,
  LayoutFormats,
  PredefinedLayerModel,
  ProjectConstants,
  Zipper,
} from '@abc-map/shared';
import uuid from 'uuid-random';
import { FeatureStyle } from '../../geo/styles/FeatureStyle';
import { PointIcons } from '@abc-map/shared';
import { Coordinate } from 'ol/coordinate';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Map } from 'ol';

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

  public static sampleProjectManifest(): AbcProjectManifest {
    return {
      metadata: {
        id: uuid(),
        version: ProjectConstants.CurrentVersion,
        name: `Test project ${uuid()}`,
        projection: DEFAULT_PROJECTION,
        containsCredentials: false,
      },
      layers: [this.sampleOsmLayer(), this.sampleVectorLayer()],
      layouts: [],
    };
  }

  public static async sampleCompressedProject(): Promise<CompressedProject<Blob>> {
    const project = this.sampleProjectManifest();
    const metadata = project.metadata;
    const zip = await Zipper.forFrontend().zipFiles([{ path: ProjectConstants.ManifestName, content: new Blob([JSON.stringify(project)]) }]);
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

  public static sampleXyzLayer(): AbcXyzLayer {
    return {
      type: LayerType.Xyz,
      metadata: {
        id: uuid(),
        name: 'Couche XYZ',
        type: LayerType.Xyz,
        visible: true,
        active: true,
        opacity: 1,
        remoteUrl: 'http://remote-url',
        projection: {
          name: 'EPSG:4326',
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
        color: '#000000',
      },
      fill: {
        color1: '#FFFFFF',
        color2: '#FF0000',
        pattern: FillPatterns.HatchingObliqueLeft,
      },
      text: {
        value: 'Test text value',
        color: '#0000FF',
        size: 30,
        font: 'sans-serif',
        offsetX: 20,
        offsetY: 30,
        alignment: 'left',
      },
      point: {
        icon: PointIcons.Star,
        size: 5,
        color: '#00FF00',
      },
      zIndex: 5,
    };
  }

  public static mapBrowserEvent(coordinate: Coordinate, resolution = 2): MapBrowserEvent<UIEvent> {
    return {
      coordinate,
      map: {
        getView() {
          return {
            getResolution() {
              return resolution;
            },
          };
        },
      },
    } as any;
  }

  public static interactionCount(map: Map, name: string): number {
    return map
      .getInteractions()
      .getArray()
      .filter((inter) => inter.constructor.name === name).length;
  }

  public static interactionNames(map: Map): string[] {
    return map
      .getInteractions()
      .getArray()
      .map((inter) => inter.constructor.name);
  }
}
