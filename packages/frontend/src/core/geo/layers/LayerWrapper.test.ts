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
  AbcPredefinedLayer,
  AbcVectorLayer,
  AbcWmsLayer,
  AbcWmtsLayer,
  AbcXyzLayer,
  LayerProperties,
  LayerType,
  PredefinedLayerModel,
  PredefinedMetadata,
  VectorMetadata,
  WmsMetadata,
  WmtsMetadata,
  XyzMetadata,
} from '@abc-map/shared';
import VectorSource from 'ol/source/Vector';
import { LayerWrapper, logger as wrapperLogger } from './LayerWrapper';
import { TestHelper } from '../../utils/test/TestHelper';
import { LayerFactory } from './LayerFactory';
import TileLayer from 'ol/layer/Tile';
import VectorImageLayer from 'ol/layer/VectorImage';
import { WmsSettings } from './LayerFactory.types';
import TileSource from 'ol/source/Tile';
import { WMTS, XYZ } from 'ol/source';
import { DefaultStyleOptions } from '../styles/StyleFactoryOptions';

wrapperLogger.disable();

describe('LayerWrapper', () => {
  describe('is', () => {
    it('predefined()', () => {
      const layer = new VectorImageLayer();
      layer.set(LayerProperties.Type, LayerType.Predefined);
      expect(LayerWrapper.from(layer).isPredefined()).toBe(true);
      expect(LayerWrapper.from(layer).isVector()).toBe(false);
      expect(LayerWrapper.from(layer).isXyz()).toBe(false);
      expect(LayerWrapper.from(layer).isWms()).toBe(false);
      expect(LayerWrapper.from(layer).isWmts()).toBe(false);
    });

    it('vector()', () => {
      const layer = new VectorImageLayer();
      layer.set(LayerProperties.Type, LayerType.Vector);
      expect(LayerWrapper.from(layer).isPredefined()).toBe(false);
      expect(LayerWrapper.from(layer).isVector()).toBe(true);
      expect(LayerWrapper.from(layer).isXyz()).toBe(false);
      expect(LayerWrapper.from(layer).isWms()).toBe(false);
      expect(LayerWrapper.from(layer).isWmts()).toBe(false);
    });

    it('wms()', () => {
      const layer = new VectorImageLayer();
      layer.set(LayerProperties.Type, LayerType.Wms);
      expect(LayerWrapper.from(layer).isPredefined()).toBe(false);
      expect(LayerWrapper.from(layer).isVector()).toBe(false);
      expect(LayerWrapper.from(layer).isXyz()).toBe(false);
      expect(LayerWrapper.from(layer).isWms()).toBe(true);
      expect(LayerWrapper.from(layer).isWmts()).toBe(false);
    });

    it('wmts()', () => {
      const layer = new TileLayer();
      layer.set(LayerProperties.Type, LayerType.Wmts);
      expect(LayerWrapper.from(layer).isPredefined()).toBe(false);
      expect(LayerWrapper.from(layer).isVector()).toBe(false);
      expect(LayerWrapper.from(layer).isXyz()).toBe(false);
      expect(LayerWrapper.from(layer).isWms()).toBe(false);
      expect(LayerWrapper.from(layer).isWmts()).toBe(true);
    });

    it('xyz()', () => {
      const layer = new TileLayer();
      layer.set(LayerProperties.Type, LayerType.Xyz);
      expect(LayerWrapper.from(layer).isPredefined()).toBe(false);
      expect(LayerWrapper.from(layer).isVector()).toBe(false);
      expect(LayerWrapper.from(layer).isXyz()).toBe(true);
      expect(LayerWrapper.from(layer).isWms()).toBe(false);
      expect(LayerWrapper.from(layer).isWmts()).toBe(false);
    });
  });

  it('getName()', () => {
    const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
    layer.unwrap().set(LayerProperties.Name, 'test-name');
    expect(layer.getName()).toEqual('test-name');
  });

  it('isActive()', () => {
    const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);

    layer.unwrap().set(LayerProperties.Active, true);
    expect(layer.isActive()).toEqual(true);

    layer.unwrap().set(LayerProperties.Active, false);
    expect(layer.isActive()).toEqual(false);
  });

  it('isVisible()', () => {
    const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);

    layer.unwrap().setVisible(true);
    expect(layer.isVisible()).toEqual(true);

    layer.unwrap().setVisible(false);
    expect(layer.isVisible()).toEqual(false);
  });

  it('getOpacity()', () => {
    const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);

    layer.unwrap().setOpacity(0.5);
    expect(layer.getOpacity()).toEqual(0.5);
  });

  describe('setId()', () => {
    it('with id', () => {
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM).setId('test-id');
      expect(layer.getId()).toEqual('test-id');
    });

    it('without id', () => {
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
      layer.unwrap().set(LayerProperties.Id, undefined);
      expect(layer.getId()).toBeUndefined();

      layer.setId();

      expect(layer.getId()).toBeDefined();
    });
  });

  describe('getMetadata()', () => {
    it('on non managed layer should return undefined', () => {
      const layer = LayerWrapper.from(new VectorImageLayer());
      expect(layer.getMetadata()).toBeUndefined();
    });

    it('on predefined layer', () => {
      // Prepare
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
      layer.setActive(true).setVisible(false).setOpacity(0.5);

      // Act
      const metadata = layer.getMetadata();

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.id).toEqual(layer.getId());
      expect(metadata?.opacity).toEqual(0.5);
      expect(metadata?.visible).toEqual(false);
      expect(metadata?.active).toEqual(true);
      expect(metadata?.model).toEqual(PredefinedLayerModel.OSM);
      expect(metadata?.type).toEqual(LayerType.Predefined);
    });

    it('on vector layer', () => {
      // Prepare
      const layer = LayerFactory.newVectorLayer(new VectorSource());
      layer.setActive(true).setVisible(false).setOpacity(0.5);

      // Act
      const metadata = layer.getMetadata();

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.id).toEqual(layer.getId());
      expect(metadata?.opacity).toEqual(0.5);
      expect(metadata?.visible).toEqual(false);
      expect(metadata?.active).toEqual(true);
      expect(metadata?.type).toEqual(LayerType.Vector);
    });

    it('on WMS layer', () => {
      // Prepare
      const def: WmsSettings = {
        capabilitiesUrl: 'http://test-url/capabilities',
        remoteUrls: ['http://test-url'],
        remoteLayerName: 'test-layer-name',
        projection: { name: 'EPSG:4326' },
        auth: {
          username: 'test-username',
          password: 'test-password',
        },
      };
      const layer = LayerFactory.newWmsLayer(def);
      layer.setActive(true).setVisible(false).setOpacity(0.5);

      // Act
      const metadata = layer.getMetadata();

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.id).toEqual(layer.getId());
      expect(metadata?.opacity).toEqual(0.5);
      expect(metadata?.visible).toEqual(false);
      expect(metadata?.active).toEqual(true);
      expect(metadata?.type).toEqual(LayerType.Wms);
      expect(metadata?.remoteLayerName).toEqual('test-layer-name');
      expect(metadata?.projection?.name).toEqual('EPSG:4326');
      expect(metadata?.auth?.username).toEqual('test-username');
      expect(metadata?.auth?.password).toEqual('test-password');
      expect(metadata?.remoteUrls).toEqual(['http://test-url']);
    });

    it('on XYZ layer', () => {
      // Prepare
      const layer = LayerFactory.newXyzLayer('http://test-url', { name: 'EPSG:4326' });
      layer.setActive(true).setVisible(false).setOpacity(0.5);

      // Act
      const metadata = layer.getMetadata();

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.id).toEqual(layer.getId());
      expect(metadata?.opacity).toEqual(0.5);
      expect(metadata?.visible).toEqual(false);
      expect(metadata?.active).toEqual(true);
      expect(metadata?.type).toEqual(LayerType.Xyz);
      expect(metadata?.remoteUrl).toEqual('http://test-url');
      expect(metadata?.projection).toEqual({ name: 'EPSG:4326' });
    });
  });

  describe('toAbcLayer()', () => {
    it('with OSM layer', async () => {
      // Prepare
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM).setVisible(false).setOpacity(0.5).setActive(true);

      // Act
      const abcLayer = (await layer.toAbcLayer()) as AbcPredefinedLayer;

      // Assert
      expect(abcLayer.type).toEqual(LayerType.Predefined);
      expect(abcLayer.metadata.id).toBeDefined();
      const expectedMetadata: PredefinedMetadata = {
        id: layer.getId() as string,
        type: LayerType.Predefined,
        name: 'OpenStreetMap',
        active: true,
        opacity: 0.5,
        visible: false,
        model: PredefinedLayerModel.OSM,
        attributions: ['© OpenStreetMap contributors.'],
      };
      expect(abcLayer.metadata).toEqual(expectedMetadata);
    });

    it('with vector layer', async () => {
      // Prepare
      const vectorSource = new VectorSource({ features: TestHelper.sampleFeatures() });
      const layer = LayerFactory.newVectorLayer(vectorSource).setVisible(false).setOpacity(0.5).setActive(true);

      // Act
      const abcLayer = (await layer.toAbcLayer()) as AbcVectorLayer;

      // Assert
      expect(abcLayer.type).toEqual(LayerType.Vector);
      expect(abcLayer.features).toBeDefined();
      expect(abcLayer.features.features.length).toEqual(3);
      expect(abcLayer.features.features[0].geometry.type).toEqual('Point');

      expect(abcLayer.metadata.id).toBeDefined();
      const expectedMetadata: VectorMetadata = {
        id: layer.getId() as string,
        type: LayerType.Vector,
        name: 'Geometries',
        active: true,
        opacity: 0.5,
        visible: false,
      };
      expect(abcLayer.metadata).toEqual(expectedMetadata);
    });

    it('with XYZ layer', async () => {
      // Prepare
      const layer = LayerFactory.newXyzLayer('http://test-url', { name: 'EPSG:4326' }).setVisible(false).setOpacity(0.5).setActive(true);

      // Act
      const abcLayer = (await layer.toAbcLayer()) as AbcXyzLayer;

      // Assert
      expect(abcLayer.type).toEqual(LayerType.Xyz);
      const expectedMetadata: XyzMetadata = {
        id: layer.getId() as string,
        type: LayerType.Xyz,
        name: 'XYZ layer',
        active: true,
        opacity: 0.5,
        visible: false,
        remoteUrl: 'http://test-url',
        projection: { name: 'EPSG:4326' },
        attributions: undefined,
      };
      expect(abcLayer.metadata.id).toBeDefined();
      expect(abcLayer.metadata).toEqual(expectedMetadata);
    });

    // Prepare
    it('with WMS layer', async () => {
      // Prepare
      const settings: WmsSettings = {
        capabilitiesUrl: 'http://domain/capabilities',
        remoteUrls: ['http://domain/GetMap'],
        remoteLayerName: 'test-layer',
        projection: { name: 'EPSG:4326' },
        extent: [1, 2, 3, 4],
        auth: {
          username: 'test-username',
          password: 'test-password',
        },
      };
      const layer = LayerFactory.newWmsLayer(settings).setVisible(false).setOpacity(0.5).setActive(true);

      // Act
      const abcLayer = (await layer.toAbcLayer()) as AbcWmsLayer;

      // Assert
      expect(abcLayer.metadata.id).toBeDefined();
      expect(abcLayer.type).toEqual(LayerType.Wms);
      const expectedMetadata: WmsMetadata = {
        id: layer.getId() as string,
        type: LayerType.Wms,
        active: true,
        opacity: 0.5,
        visible: false,
        name: 'test-layer',
        remoteUrls: ['http://domain/GetMap'],
        remoteLayerName: 'test-layer',
        projection: { name: 'EPSG:4326' },
        extent: [1, 2, 3, 4],
        auth: {
          username: 'test-username',
          password: 'test-password',
        },
      };
      expect(abcLayer.metadata).toEqual(expectedMetadata);
    });

    it('with WMTS layer', async () => {
      // Prepare
      const settings = TestHelper.sampleWmtsSettings();
      const layer = LayerFactory.newWmtsLayer(settings).setVisible(false).setOpacity(0.5).setActive(true);

      // Act
      const abcLayer = (await layer.toAbcLayer()) as AbcWmtsLayer;

      // Assert
      expect(abcLayer.metadata.id).toBeDefined();
      expect(abcLayer.type).toEqual(LayerType.Wmts);
      const expectedMetadata: WmtsMetadata = {
        id: layer.getId() as string,
        type: LayerType.Wmts,
        active: true,
        opacity: 0.5,
        visible: false,
        name: 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
        remoteLayerName: 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
        capabilitiesUrl: 'http://domain.fr/wmts',
        auth: {
          username: 'test-username',
          password: 'test-password',
        },
      };
      expect(abcLayer.metadata).toEqual(expectedMetadata);
    });
  });
});

describe('shallowClone()', () => {
  it('with predefined layer', () => {
    // Prepare
    const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);

    // Act
    const clone = layer.shallowClone();

    // Assert
    expect(clone.unwrap()).toBeInstanceOf(TileLayer);
    expect(clone.unwrap().getSource()).toStrictEqual(layer.unwrap().getSource());
    expect(clone.unwrap()).not.toStrictEqual(layer.unwrap());
    expect(clone.getMetadata()).toEqual(layer.getMetadata());
  });

  it('with vector layer', () => {
    // Prepare
    const layer = LayerFactory.newVectorLayer();

    // Act
    const clone = layer.shallowClone({ ratio: 4 });

    // Assert
    expect(clone.unwrap()).toBeInstanceOf(VectorImageLayer);
    expect(clone.unwrap().getSource()).toStrictEqual(layer.unwrap().getSource());
    expect(clone.unwrap()).not.toStrictEqual(layer.unwrap());
    expect(clone.getMetadata()).toEqual(layer.getMetadata());
    expect(clone.unwrap().get(LayerProperties.StyleOptions)).toEqual({ ...DefaultStyleOptions, ratio: 4 });
  });

  it('with WMS layer', () => {
    // Prepare
    const settings: WmsSettings = {
      capabilitiesUrl: 'http://test-url/capabilities',
      remoteUrls: ['http://test-url'],
      remoteLayerName: 'test-layer-name',
      projection: { name: 'EPSG:4326' },
      auth: {
        username: 'test-username',
        password: 'test-password',
      },
    };
    const layer = LayerFactory.newWmsLayer(settings);

    // Act
    const clone = layer.shallowClone();

    // Assert
    expect(clone.unwrap()).toBeInstanceOf(TileLayer);
    expect(clone.unwrap().getSource()).toBeInstanceOf(TileSource);
    expect(clone.unwrap().getSource()).toStrictEqual(layer.unwrap().getSource());
    expect(clone.unwrap()).not.toStrictEqual(layer.unwrap());
    expect(clone.getMetadata()).toEqual(layer.getMetadata());
  });

  it('with WMTS layer', () => {
    // Prepare
    const settings = TestHelper.sampleWmtsSettings();
    const layer = LayerFactory.newWmtsLayer(settings);

    // Act
    const clone = layer.shallowClone();

    // Assert
    expect(clone.unwrap()).toBeInstanceOf(TileLayer);
    expect(clone.unwrap().getSource()).toBeInstanceOf(WMTS);
    expect(clone.unwrap().getSource()).toStrictEqual(layer.unwrap().getSource());
    expect(clone.unwrap()).not.toStrictEqual(layer.unwrap());
    expect(clone.getMetadata()).toEqual(layer.getMetadata());
  });

  it('with XYZ layer', () => {
    // Prepare
    const settings = TestHelper.sampleXyzLayer().metadata;
    const layer = LayerFactory.newXyzLayer(settings.remoteUrl, settings.projection);

    // Act
    const clone = layer.shallowClone();

    // Assert
    expect(clone.unwrap()).toBeInstanceOf(TileLayer);
    expect(clone.unwrap().getSource()).toBeInstanceOf(XYZ);
    expect(clone.unwrap().getSource()).toStrictEqual(layer.unwrap().getSource());
    expect(clone.unwrap()).not.toStrictEqual(layer.unwrap());
    expect(clone.getMetadata()).toEqual(layer.getMetadata());
  });
});
