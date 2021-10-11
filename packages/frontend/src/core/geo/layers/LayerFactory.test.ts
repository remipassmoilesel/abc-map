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
import { TileWMS, WMTS } from 'ol/source';
import { LayerProperties, LayerType, PredefinedLayerModel } from '@abc-map/shared';
import TileLayer from 'ol/layer/Tile';
import VectorImageLayer from 'ol/layer/VectorImage';
import { WmsSettings } from './LayerFactory.types';
import { TestHelper } from '../../utils/test/TestHelper';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

describe('LayerFactory', () => {
  describe('newPredefinedLayer()', () => {
    it('OSM', () => {
      // Act
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.OSM);

      // Assert
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
      // Act
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenToner);

      // Assert
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
      // Act
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenTonerLite);

      // Assert
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
      // Act
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenTerrain);

      // Assert
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
      // Act
      const layer = LayerFactory.newPredefinedLayer(PredefinedLayerModel.StamenWatercolor);

      // Assert
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
      // Act
      const layer = LayerFactory.newVectorLayer();

      // Assert
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('Geometries');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Vector);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(VectorImageLayer);
      expect(layer.unwrap().getSource()).toBeDefined();
    });

    it('with source', () => {
      // Prepare
      const source = new VectorSource();

      // Act
      const layer = LayerFactory.newVectorLayer(source);

      // Assert
      expect(layer.unwrap().getSource()).toStrictEqual(source);
    });
  });

  describe('newWmsLayer()', () => {
    it('without authentication', () => {
      // Prepare
      const def: WmsSettings = {
        remoteUrls: ['http://test-url'],
        remoteLayerName: 'test-layer-name',
        projection: { name: 'EPSG:4326' },
      };

      // Act
      const layer = LayerFactory.newWmsLayer(def);

      // Assert
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

      const source = layer.unwrap().getSource() as TileWMS;
      expect(source).toBeInstanceOf(TileWMS);
      expect(source.getUrls()).toEqual(['http://test-url']);
      expect(source.getParams()).toEqual({ LAYERS: 'test-layer-name', TILED: true });
      expect(source.getTileLoadFunction().toString()).not.toContain('authClient');
    });

    it('with authentication', () => {
      // Prepare
      const settings: WmsSettings = {
        remoteUrls: ['http://test-url'],
        remoteLayerName: 'test-layer-name',
        projection: { name: 'EPSG:4326' },
        auth: {
          username: 'test-username',
          password: 'test-password',
        },
      };

      // Act
      const layer = LayerFactory.newWmsLayer(settings);

      // Assert
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

      const source = layer.unwrap().getSource() as TileWMS;
      expect(source).toBeInstanceOf(TileWMS);
      expect(source.getUrls()).toEqual(['http://test-url']);
      expect(source.getParams()).toEqual({ LAYERS: 'test-layer-name', TILED: true });
      expect(source.getTileLoadFunction().toString()).toContain('authClient');
    });
  });

  describe('newWmtsLayer()', () => {
    it('without authentication', () => {
      // Prepare
      const settings = {
        ...TestHelper.sampleWmtsSettings(),
        auth: undefined,
      };

      // Act
      const layer = LayerFactory.newWmtsLayer(settings);

      // Assert
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('GEOGRAPHICALGRIDSYSTEMS.MAPS');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Wmts);
      expect(metadata?.capabilitiesUrl).toEqual('http://domain.fr/wmts');
      expect(metadata?.remoteLayerName).toEqual('GEOGRAPHICALGRIDSYSTEMS.MAPS');
      expect(metadata?.auth).toEqual(undefined);
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);

      const source = layer.unwrap().getSource() as WMTS;
      expect(source).toBeInstanceOf(WMTS);
      expect(source.getTileGrid()).toBeInstanceOf(WMTSTileGrid);
      expect(source.getTileLoadFunction().toString()).not.toContain('authClient');
    });

    it('with authentication', () => {
      // Prepare
      const settings = TestHelper.sampleWmtsSettings();

      // Act
      const layer = LayerFactory.newWmtsLayer(settings);

      // Assert
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('GEOGRAPHICALGRIDSYSTEMS.MAPS');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Wmts);
      expect(metadata?.capabilitiesUrl).toEqual('http://domain.fr/wmts');
      expect(metadata?.remoteLayerName).toEqual('GEOGRAPHICALGRIDSYSTEMS.MAPS');
      expect(metadata?.auth).toEqual({ password: 'test-password', username: 'test-username' });
      expect(layer.unwrap().get(LayerProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);

      const source = layer.unwrap().getSource() as WMTS;
      expect(source).toBeInstanceOf(WMTS);
      expect(source.getTileGrid()).toBeInstanceOf(WMTSTileGrid);
      expect(source.getTileLoadFunction().toString()).toContain('authClient');
    });
  });
});
