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
  AbcLegend,
  AbcLegendItem,
  AbcPredefinedLayer,
  AbcProjectManifest,
  AbcSharedView,
  AbcVectorLayer,
  AbcView,
  AbcWmsLayer,
  AbcWmtsLayer,
  AbcXyzLayer,
  ArtefactType,
  CompressedProject,
  DEFAULT_PROJECTION,
  FeatureStyle,
  FillPatterns,
  Language,
  LayerType,
  LayoutFormats,
  LegendDisplay,
  PredefinedLayerModel,
  ProjectConstants,
  ProjectionDto,
  WmsMetadata,
  XyzMetadata,
  Zipper,
} from '@abc-map/shared';
import uuid from 'uuid-random';
import { Coordinate } from 'ol/coordinate';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import Map from 'ol/Map';
import { RegionsOfMetropolitanFrance, SampleWmsCapabilities, SampleWmtsCapabilities } from './TestHelper.data';
import { TestDataSource } from '../../data/data-source/TestDataSource';
import { VectorLayerWrapper } from '../../geo/layers/LayerWrapper';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';
import { LayerFactory } from '../../geo/layers/LayerFactory';
import { IconName } from '../../../assets/point-icons/IconName';
import { nanoid } from 'nanoid';
import { Encryption } from '../Encryption';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { WmtsSettings } from '../../geo/layers/LayerFactory.types';
import { WmtsCapabilities } from '../../geo/WmtsCapabilities';
import { optionsFromCapabilities } from 'ol/source/WMTS';
import { WmsCapabilities } from '../../geo/WmsCapabilities';

interface EventSettings {
  coordinate?: Coordinate;
  resolution?: number;
  type?: typeof MapBrowserEventType;
  ctrlKey?: boolean;
  button?: number;
  mapTarget?: HTMLDivElement;
  pixel?: [number, number];
}

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
        containsCredentials: false,
        public: false,
      },
      layers: [this.sampleOsmLayer(), this.sampleVectorLayer()],
      layouts: [],
      view: {
        center: [1, 2],
        projection: DEFAULT_PROJECTION,
        resolution: 1000,
      },
      sharedViews: [],
    };
  }

  public static async sampleCompressedProject(template?: Partial<AbcProjectManifest>): Promise<[CompressedProject<Blob>, AbcProjectManifest]> {
    const sampleProject = this.sampleProjectManifest();
    const project: AbcProjectManifest = {
      ...sampleProject,
      ...template,
      metadata: {
        ...sampleProject.metadata,
        ...template?.metadata,
      },
    };

    const zip = await Zipper.forFrontend().zipFiles([{ path: ProjectConstants.ManifestName, content: new Blob([JSON.stringify(project)]) }]);
    return [{ metadata: project.metadata, project: zip }, project];
  }

  public static async sampleCompressedProtectedProject(template?: Partial<AbcProjectManifest>): Promise<[CompressedProject<Blob>, AbcProjectManifest]> {
    let project = this.sampleProjectManifest();
    project = {
      ...project,
      ...template,
      metadata: {
        ...project.metadata,
        ...template?.metadata,
      },
    };

    if (typeof template === 'undefined') {
      const wmsLayer = this.sampleWmsLayer();
      wmsLayer.metadata.auth = { username: 'test-username', password: 'test-password' };
      project.layers.push(wmsLayer);
    }

    project = await Encryption.encryptManifest(project, 'azerty1234');

    const zip = await Zipper.forFrontend().zipFiles([{ path: ProjectConstants.ManifestName, content: new Blob([JSON.stringify(project)]) }]);
    return [{ metadata: project.metadata, project: zip }, project];
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

  public static sampleWmsLayer(template?: Partial<WmsMetadata>): AbcWmsLayer {
    return {
      type: LayerType.Wms,
      metadata: {
        id: uuid(),
        name: 'Couche WMS',
        type: LayerType.Wms,
        visible: true,
        active: true,
        opacity: 1,
        remoteUrls: ['http://domain.fr/wms'],
        remoteLayerName: 'test-layer-name',
        projection: {
          name: 'EPSG:4326',
        },
        extent: [1, 2, 3, 4],
        auth: {
          username: 'test-username',
          password: 'test-password',
        },
        ...template,
      },
    };
  }

  public static sampleWmsCapabilities(): WmsCapabilities {
    return SampleWmsCapabilities();
  }

  public static sampleWmtsLayer(): AbcWmtsLayer {
    return {
      type: LayerType.Wmts,
      metadata: {
        id: uuid(),
        name: 'Couche WMTS',
        type: LayerType.Wmts,
        visible: true,
        active: true,
        opacity: 1,
        ...this.sampleWmtsSettings(),
      },
    };
  }

  public static sampleWmtsCapabilities(): WmtsCapabilities {
    return SampleWmtsCapabilities();
  }

  public static sampleWmtsSettings(): WmtsSettings {
    return {
      capabilitiesUrl: 'http://domain.fr/wmts',
      remoteLayerName: 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
      sourceOptions: optionsFromCapabilities(TestHelper.sampleWmtsCapabilities(), { layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', matrixSet: 'PM' }) || undefined,
      auth: {
        username: 'test-username',
        password: 'test-password',
      },
    };
  }

  public static sampleXyzLayer(template?: Partial<XyzMetadata>): AbcXyzLayer {
    return {
      type: LayerType.Xyz,
      metadata: {
        id: uuid(),
        name: 'Couche XYZ',
        type: LayerType.Xyz,
        visible: true,
        active: true,
        opacity: 1,
        remoteUrl: 'http://domain.fr/xyz/{x}/{y}/{z}',
        projection: {
          name: 'EPSG:4326',
        },
        ...template,
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
      name: [{ language: Language.English, text: 'Sample artefact' }],
      type: ArtefactType.Vector,
      path: '/sample/manifest.yaml',
      files: ['file/1.gpx', 'file/2.kml'],
      provider: 'Somewhere inc',
      link: 'http://somewhere',
      license: 'LICENSE.txt',
      attributions: ['Copyright somewhat somewhere'],
      keywords: [{ language: Language.English, text: ['gpx', 'kml'] }],
      description: [{ language: Language.English, text: 'A sample artefact' }],
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
      legend: this.sampleLegend(),
    };
  }

  public static sampleView(): AbcView {
    return {
      center: [1.5, 45.4],
      resolution: 1000,
      projection: DEFAULT_PROJECTION,
    };
  }

  public static sampleSharedView(): AbcSharedView {
    return {
      id: uuid(),
      title: 'Sample layout',
      view: this.sampleView(),
      layers: [],
      legend: this.sampleLegend(),
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
        rotation: 5,
      },
      point: {
        icon: IconName.IconMoonStars,
        size: 5,
        color: '#00FF00',
      },
      zIndex: 5,
    };
  }

  public static mapBrowserEvent(settings: EventSettings): MapBrowserEvent<any> {
    return {
      type: settings.type ?? MapBrowserEventType.POINTERDOWN,
      coordinate: settings.coordinate ?? [1, 1],
      pixel: settings.pixel ?? [10, 10],
      originalEvent: {
        ctrlKey: settings.ctrlKey,
        button: settings.button,
      },
      map: {
        getView() {
          return {
            getResolution() {
              return settings.resolution ?? 2;
            },
          };
        },
        getTarget() {
          return settings.mapTarget;
        },
      },
    } as unknown as MapBrowserEvent<UIEvent>;
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
    return RegionsOfMetropolitanFrance()
      .slice()
      .map((row) => ({ ...row }));
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

  public static sampleLegend(): AbcLegend {
    return {
      id: nanoid(),
      display: LegendDisplay.BottomLeftCorner,
      items: [this.sampleLegendItem(), this.sampleLegendItem()],
      height: 250,
      width: 350,
    };
  }

  public static sampleLegendItem(): AbcLegendItem {
    return {
      id: nanoid(),
      text: 'Legend item text',
    };
  }

  public static sampleProjectionDto(): ProjectionDto {
    /* eslint-disable */
    return {
      code: '2154',
      kind: 'CRS-PROJCRS',
      bbox: [51.56, -9.86, 41.15, 10.38],
      wkt: 'PROJCS["RGF93 / Lambert-93",GEOGCS["RGF93",DATUM["Reseau_Geodesique_Francais_1993",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6171"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4171"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",49],PARAMETER["standard_parallel_2",44],PARAMETER["latitude_of_origin",46.5],PARAMETER["central_meridian",3],PARAMETER["false_easting",700000],PARAMETER["false_northing",6600000],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],AUTHORITY["EPSG","2154"]]',
      unit: 'metre',
      proj4: '+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      name: 'RGF93 / Lambert-93',
      area: 'France - onshore and offshore, mainland and Corsica.',
      default_trans: 1671,
      trans: [1671, 8573],
      accuracy: 1,
    };
    /* eslint-enable */
  }

  public static sampleCsvFile(content: string): File {
    return new File([content], 'test.csv', { type: 'text/csv' });
  }

  public static comparableObjects<T extends { id: string }>(objs: T[]): T[] {
    return objs.map((obj) => ({ ...obj, id: '#comparable-id#' }));
  }
}
