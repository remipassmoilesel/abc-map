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
import { Point, Polygon } from 'ol/geom';
import {
  AbcArtefact,
  AbcLayout,
  AbcLegendItem,
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
  LegendDisplay,
  PredefinedLayerModel,
  ProjectConstants,
  Zipper,
} from '@abc-map/shared';
import uuid from 'uuid-random';
import { Coordinate } from 'ol/coordinate';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Map } from 'ol';
import { RegionsOfMetropolitanFrance } from './TestHelper.data';
import { TestDataSource } from '../../data/data-source/TestDataSource';
import { VectorLayerWrapper } from '../../geo/layers/LayerWrapper';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { LayerFactory } from '../../geo/layers/LayerFactory';
import { PointIconName } from '../../../assets/point-icons/PointIconName';
import { nanoid } from 'nanoid';
import { FeatureStyle } from '@abc-map/shared';
import { Encryption } from '../Encryption';

export class TestHelper {
  public static renderMap(map: Map): Promise<void> {
    return new Promise<void>((resolve) => {
      map.render();
      // This should be rendercomplete
      map.once('rendercomplete', () => {
        resolve();
      });
    });
  }

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

  public static async sampleCompressedProject(): Promise<[CompressedProject<Blob>, AbcProjectManifest]> {
    const project = this.sampleProjectManifest();
    const metadata = project.metadata;
    const zip = await Zipper.forFrontend().zipFiles([{ path: ProjectConstants.ManifestName, content: new Blob([JSON.stringify(project)]) }]);
    return [{ metadata, project: zip }, project];
  }

  public static async sampleCompressedProtectedProject(): Promise<[CompressedProject<Blob>, AbcProjectManifest]> {
    let project = this.sampleProjectManifest();
    const wmsLayer = this.sampleWmsLayer();
    wmsLayer.metadata.auth = { username: 'test-username', password: 'test-password' };
    project.layers.push(wmsLayer);

    project = await Encryption.encryptManifest(project, 'azerty1234');
    project.metadata.containsCredentials = true;

    const metadata = project.metadata;
    const zip = await Zipper.forFrontend().zipFiles([{ path: ProjectConstants.ManifestName, content: new Blob([JSON.stringify(project)]) }]);
    return [{ metadata, project: zip }, project];
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
        font: 'AbcCantarell',
        offsetX: 20,
        offsetY: 30,
        alignment: 'left',
      },
      point: {
        icon: PointIconName.IconMoonStars,
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

  public static regionsOfFrance() {
    return RegionsOfMetropolitanFrance.slice().map((row) => ({ ...row }));
  }

  public static regionsOfFranceDataSource(): TestDataSource {
    return TestDataSource.from(this.regionsOfFrance());
  }

  public static regionsOfFranceVectorLayer(): VectorLayerWrapper {
    const features = this.regionsOfFrance().map((reg) => {
      const feat = FeatureWrapper.create(
        new Polygon([
          [
            [reg.code, reg.code],
            [reg.code + 1, reg.code + 1],
            [reg.code, reg.code],
          ],
        ])
      );
      feat.unwrap().setId(reg._id);
      feat.unwrap().set('CODE', reg.code);
      feat.unwrap().set('NAME', reg.name);
      feat.unwrap().set('POP_PERCENT', reg.popPercent);
      feat.unwrap().set('POP', reg.population);
      return feat.unwrap();
    });

    const layer = LayerFactory.newVectorLayer();
    layer.setName('Regions of France');
    layer.getSource().addFeatures(features);

    return layer;
  }

  public static sampleLegendItem(): AbcLegendItem {
    return {
      id: nanoid(),
      text: 'Legend item text',
    };
  }
}
