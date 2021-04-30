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
  LayerProperties,
  LayerType,
  PredefinedLayerModel,
  PredefinedMetadata,
  VectorMetadata,
  WmsDefinition,
} from '@abc-map/shared-entities';
import VectorSource from 'ol/source/Vector';
import { LayerWrapper, logger as wrapperLogger } from './LayerWrapper';
import { TestHelper } from '../../utils/TestHelper';
import { LayerFactory } from './LayerFactory';
import TileLayer from 'ol/layer/Tile';
import VectorImageLayer from 'ol/layer/VectorImage';

wrapperLogger.disable();

describe('LayerWrapper', () => {
  describe('is', () => {
    it('predefined()', () => {
      const layer = new VectorImageLayer();
      layer.set(LayerProperties.Type, LayerType.Predefined);
      expect(LayerWrapper.from(layer).isPredefined()).toBe(true);
      expect(LayerWrapper.from(layer).isVector()).toBe(false);
      expect(LayerWrapper.from(layer).isWms()).toBe(false);
    });

    it('vector()', () => {
      const layer = new VectorImageLayer();
      layer.set(LayerProperties.Type, LayerType.Vector);
      expect(LayerWrapper.from(layer).isVector()).toBe(true);
      expect(LayerWrapper.from(layer).isPredefined()).toBe(false);
      expect(LayerWrapper.from(layer).isWms()).toBe(false);
    });

    it('wms()', () => {
      const layer = new VectorImageLayer();
      layer.set(LayerProperties.Type, LayerType.Wms);
      expect(LayerWrapper.from(layer).isWms()).toBe(true);
      expect(LayerWrapper.from(layer).isPredefined()).toBe(false);
      expect(LayerWrapper.from(layer).isVector()).toBe(false);
    });
  });

  it('getName()', () => {
    const layer = LayerFactory.newOsmLayer();
    layer.unwrap().set(LayerProperties.Name, 'test-name');
    expect(layer.getName()).toEqual('test-name');
  });

  it('isActive()', () => {
    const layer = LayerFactory.newOsmLayer();

    layer.unwrap().set(LayerProperties.Active, true);
    expect(layer.isActive()).toEqual(true);

    layer.unwrap().set(LayerProperties.Active, false);
    expect(layer.isActive()).toEqual(false);
  });

  it('isVisible()', () => {
    const layer = LayerFactory.newOsmLayer();

    layer.unwrap().setVisible(true);
    expect(layer.isVisible()).toEqual(true);

    layer.unwrap().setVisible(false);
    expect(layer.isVisible()).toEqual(false);
  });

  it('getOpacity()', () => {
    const layer = LayerFactory.newOsmLayer();

    layer.unwrap().setOpacity(0.5);
    expect(layer.getOpacity()).toEqual(0.5);
  });

  describe('setId()', () => {
    it('with id', () => {
      const layer = LayerFactory.newOsmLayer().setId('test-id');
      expect(layer.getId()).toEqual('test-id');
    });

    it('without id', () => {
      const layer = LayerFactory.newOsmLayer();
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
      const layer = LayerFactory.newOsmLayer();
      layer.setActive(true).setVisible(false).setOpacity(0.5);

      const metadata = layer.getMetadata();
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
      const layer = LayerFactory.newVectorLayer(new VectorSource());
      layer.setActive(true).setVisible(false).setOpacity(0.5);

      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.id).toEqual(layer.getId());
      expect(metadata?.opacity).toEqual(0.5);
      expect(metadata?.visible).toEqual(false);
      expect(metadata?.active).toEqual(true);
      expect(metadata?.type).toEqual(LayerType.Vector);
    });

    it('on WMS layer', () => {
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
      layer.setActive(true).setVisible(false).setOpacity(0.5);

      const metadata = layer.getMetadata();
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
      expect(metadata?.remoteUrl).toEqual('http://test-url');
    });
  });

  describe('toAbcLayer()', () => {
    it('with OSM layer', async () => {
      const layer = LayerFactory.newOsmLayer().setVisible(false).setOpacity(0.5).setActive(true);

      const abcLayer = (await layer.toAbcLayer()) as AbcPredefinedLayer;

      expect(abcLayer.type).toEqual(LayerType.Predefined);
      const expectedMetadata: PredefinedMetadata = {
        id: layer.getId() as string,
        type: LayerType.Predefined,
        name: 'OpenStreetMap',
        active: true,
        opacity: 0.5,
        visible: false,
        model: PredefinedLayerModel.OSM,
      };
      expect(abcLayer.metadata.id).toBeDefined();
      expect(abcLayer.metadata).toEqual(expectedMetadata);
    });

    it('with vector layer', async () => {
      const vectorSource = new VectorSource({ features: TestHelper.sampleFeatures() });
      const layer = LayerFactory.newVectorLayer(vectorSource).setVisible(false).setOpacity(0.5).setActive(true);

      const abcLayer = (await layer.toAbcLayer()) as AbcVectorLayer;

      expect(abcLayer.type).toEqual(LayerType.Vector);
      expect(abcLayer.features).toBeDefined();
      expect(abcLayer.features.features.length).toEqual(3);
      expect(abcLayer.features.features[0].geometry.type).toEqual('Point');
      const expectedMetadata: VectorMetadata = {
        id: layer.getId() as string,
        type: LayerType.Vector,
        name: 'Géométries',
        active: true,
        opacity: 0.5,
        visible: false,
      };
      expect(abcLayer.metadata.id).toBeDefined();
      expect(abcLayer.metadata).toEqual(expectedMetadata);
    });
  });

  describe('shallowClone()', () => {
    it('with tile layer', () => {
      const layer = LayerFactory.newOsmLayer();
      const clone = layer.shallowClone();
      expect(clone).toBeDefined();
      expect(clone.unwrap()).toBeInstanceOf(TileLayer);
      expect(clone.unwrap().getSource()).toStrictEqual(layer.unwrap().getSource());
      expect(clone.unwrap()).not.toStrictEqual(layer.unwrap());
      expect(clone.getMetadata()).toEqual(layer.getMetadata());
    });

    it('with vector layer', () => {
      const layer = LayerFactory.newVectorLayer();
      const clone = layer.shallowClone();
      expect(clone).toBeDefined();
      expect(clone.unwrap()).toBeInstanceOf(VectorImageLayer);
      expect(clone.unwrap().getSource()).toStrictEqual(layer.unwrap().getSource());
      expect(clone.unwrap()).not.toStrictEqual(layer.unwrap());
      expect(clone.getMetadata()).toEqual(layer.getMetadata());
    });

    it('with WMS layer', () => {
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
      const clone = layer.shallowClone();
      expect(clone).toBeDefined();
      expect(clone.unwrap()).toBeInstanceOf(TileLayer);
      expect(clone.unwrap().getSource()).toStrictEqual(layer.unwrap().getSource());
      expect(clone.unwrap()).not.toStrictEqual(layer.unwrap());
      expect(clone.getMetadata()).toEqual(layer.getMetadata());
    });
  });
});
