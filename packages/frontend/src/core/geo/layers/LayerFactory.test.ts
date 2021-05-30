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

import { LayerFactory } from './LayerFactory';
import VectorSource from 'ol/source/Vector';
import { TileWMS } from 'ol/source';
import { LayerProperties, LayerType, PredefinedLayerModel, WmsDefinition } from '@abc-map/shared';
import { TestHelper } from '../../utils/test/TestHelper';
import TileLayer from 'ol/layer/Tile';
import { VectorLayerWrapper, WmsLayerWrapper } from './LayerWrapper';
import VectorImageLayer from 'ol/layer/VectorImage';

describe('LayerFactory', () => {
  describe('newPredefinedLayer()', () => {
    it('OSM', () => {
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('OpenStreetMap');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Predefined);
      expect(metadata?.model).toEqual(PredefinedLayerModel.OSM);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
    });

    it('StamenToner', () => {
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenToner);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('Stamen Toner');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Predefined);
      expect(metadata?.model).toEqual(PredefinedLayerModel.StamenToner);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
    });

    it('StamenTonerLite', () => {
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenTonerLite);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('Stamen Toner Lite');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Predefined);
      expect(metadata?.model).toEqual(PredefinedLayerModel.StamenTonerLite);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
    });

    it('StamenTerrain', () => {
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenTerrain);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('Stamen Terrain');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Predefined);
      expect(metadata?.model).toEqual(PredefinedLayerModel.StamenTerrain);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
    });

    it('StamenWatercolor', () => {
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenWatercolor);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('Stamen Watercolor');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Predefined);
      expect(metadata?.model).toEqual(PredefinedLayerModel.StamenWatercolor);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
    });
  });

  describe('newVectorLayer()', () => {
    it('without source', () => {
      const layer = LayerFactory.newVectorLayer();
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('Géométries');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Vector);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(VectorImageLayer);
      expect(layer.unwrap().getSource()).toBeDefined();
    });

    it('with source', () => {
      const source = new VectorSource();
      const layer = LayerFactory.newVectorLayer(source);
      expect(layer.unwrap().getSource()).toStrictEqual(source);
    });
  });

  describe('newWmsLayer()', () => {
    it('without authentication', () => {
      const def: WmsDefinition = {
        remoteUrl: 'http://test-url',
        remoteLayerName: 'test-layer-name',
        projection: { name: 'EPSG:4326' },
      };
      const layer = LayerFactory.newWmsLayer(def);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('test-layer-name');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Wms);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
      const source: TileWMS = layer.unwrap().getSource() as TileWMS;
      expect(source).toBeInstanceOf(TileWMS);
      expect(source.getUrls()).toEqual(['http://test-url']);
      expect(source.getParams()).toEqual({ LAYERS: 'test-layer-name', TILED: true });
      expect(source.getTileLoadFunction().toString()).not.toContain('authClient');
    });

    it('with authentication', () => {
      const def: WmsDefinition = {
        remoteUrl: 'http://test-url',
        remoteLayerName: 'test-layer-name',
        projection: { name: 'EPSG:4326' },
        auth: {
          username: 'test-username',
          password: 'test-password',
        },
      };
      const layer = LayerFactory.newWmsLayer(def);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('test-layer-name');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Wms);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
      const source: TileWMS = layer.unwrap().getSource() as TileWMS;
      expect(source).toBeInstanceOf(TileWMS);
      expect(source.getUrls()).toEqual(['http://test-url']);
      expect(source.getParams()).toEqual({ LAYERS: 'test-layer-name', TILED: true });
      expect(source.getTileLoadFunction().toString()).toContain('authClient');
    });
  });

  describe('fromAbcLayer()', () => {
    it('with OSM layer', async () => {
      const abcLayer = TestHelper.sampleOsmLayer();
      abcLayer.metadata.name = 'OpenStreetMap';
      abcLayer.metadata.opacity = 0.5;
      abcLayer.metadata.active = true;
      abcLayer.metadata.visible = false;

      const layer = await LayerFactory.fromAbcLayer(abcLayer);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.id).toEqual(abcLayer.metadata.id);
      expect(metadata?.name).toEqual('OpenStreetMap');
      expect(metadata?.opacity).toEqual(0.5);
      expect(metadata?.visible).toEqual(false);
      expect(metadata?.active).toEqual(true);
      expect(metadata?.type).toEqual(LayerType.Predefined);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
    });

    it('with vector layer', async () => {
      const abcLayer = TestHelper.sampleVectorLayer();
      abcLayer.features.features = [TestHelper.sampleGeojsonFeature(), TestHelper.sampleGeojsonFeature()];
      abcLayer.metadata.name = 'What a beautiful layer';
      abcLayer.metadata.opacity = 0.5;
      abcLayer.metadata.active = true;
      abcLayer.metadata.visible = false;

      const layer = (await LayerFactory.fromAbcLayer(abcLayer)) as VectorLayerWrapper;
      expect(layer.unwrap()).toBeInstanceOf(VectorImageLayer);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.id).toEqual(abcLayer.metadata.id);
      expect(metadata?.name).toEqual('What a beautiful layer');
      expect(metadata?.opacity).toEqual(0.5);
      expect(metadata?.visible).toEqual(false);
      expect(metadata?.active).toEqual(true);
      expect(metadata?.type).toEqual(LayerType.Vector);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(VectorImageLayer);

      const features = layer.getSource().getFeatures();
      expect(features).toHaveLength(2);
    });

    it('with wms layer, without authentication', async () => {
      const abcLayer = TestHelper.sampleWmsLayer();
      abcLayer.metadata.auth = undefined;
      abcLayer.metadata.opacity = 0.5;
      abcLayer.metadata.active = true;
      abcLayer.metadata.visible = false;

      const layer = (await LayerFactory.fromAbcLayer(abcLayer)) as WmsLayerWrapper;

      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.id).toEqual(abcLayer.metadata.id);
      expect(metadata?.name).toEqual('Couche WMS');
      expect(metadata?.opacity).toEqual(0.5);
      expect(metadata?.visible).toEqual(false);
      expect(metadata?.active).toEqual(true);
      expect(metadata?.type).toEqual(LayerType.Wms);
      expect(metadata?.remoteUrl).toEqual('http://remote-url');
      expect(metadata?.remoteLayerName).toEqual('test-layer-name');
      expect(metadata?.extent).toEqual([1, 2, 3, 4]);
      expect(metadata?.auth).toBeUndefined();
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
    });

    it('with wms layer, with authentication', async () => {
      const abcLayer = TestHelper.sampleWmsLayer();
      abcLayer.metadata.opacity = 0.5;
      abcLayer.metadata.active = true;
      abcLayer.metadata.visible = false;

      const layer = (await LayerFactory.fromAbcLayer(abcLayer)) as WmsLayerWrapper;

      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.remoteUrl).toEqual('http://remote-url');
      expect(metadata?.remoteLayerName).toEqual('test-layer-name');
      expect(metadata?.extent).toEqual([1, 2, 3, 4]);
      expect(metadata?.auth?.username).toEqual('test-username');
      expect(metadata?.auth?.password).toEqual('test-password');
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
    });
  });
});
