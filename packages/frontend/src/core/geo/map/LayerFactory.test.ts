import { LayerFactory } from './LayerFactory';
import { AbcProperties, LayerProperties, PredefinedLayerProperties, WmsDefinition } from '@abc-map/shared-entities';
import { LayerMetadata, AbcVectorLayer, LayerType, PredefinedLayerModel } from '@abc-map/shared-entities';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import * as E from 'fp-ts/Either';
import { TestHelper } from '../../utils/TestHelper';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import { LayerMetadataHelper } from './LayerMetadataHelper';
import { TileWMS } from 'ol/source';

// TODO: improve tests
describe('LayerFactory', () => {
  it('newOsmLayer()', () => {
    const layer = LayerFactory.newOsmLayer();
    expect(layer.get(AbcProperties.Managed)).toBe(true);
    expect(layer.get(LayerProperties.Id)).toBeDefined();
    expect(layer.get(LayerProperties.Name)).toEqual('OpenStreetMap');
    expect(layer.get(LayerProperties.Type)).toEqual(LayerType.Predefined);
    expect(layer.get(PredefinedLayerProperties.Model)).toEqual(PredefinedLayerModel.OSM);
    expect(layer.get(LayerProperties.Active)).toEqual(false);
  });

  describe('newVectorLayer()', () => {
    it('without source', () => {
      const layer = LayerFactory.newVectorLayer();
      expect(layer.get(AbcProperties.Managed)).toBe(true);
      expect(layer.get(LayerProperties.Id)).toBeDefined();
      expect(layer.get(LayerProperties.Name)).toBeDefined();
      expect(layer.get(LayerProperties.Type)).toEqual(LayerType.Vector);
      expect(layer.get(LayerProperties.Active)).toEqual(false);

      expect(layer.getSource()).toBeDefined();
    });

    it('with source', () => {
      const source = new VectorSource();
      const layer = LayerFactory.newVectorLayer(source);
      expect(layer.get(AbcProperties.Managed)).toBe(true);
      expect(layer.get(LayerProperties.Id)).toBeDefined();
      expect(layer.get(LayerProperties.Name)).toBeDefined();
      expect(layer.get(LayerProperties.Type)).toEqual(LayerType.Vector);
      expect(layer.get(LayerProperties.Active)).toEqual(false);

      expect(layer.getSource()).toEqual(source);
    });
  });

  describe('newWmsLayer()', () => {
    it('without authentication', () => {
      const def: WmsDefinition = {
        url: 'http://test-url',
        layerName: 'test-layer-name',
        projection: { name: 'EPSG:4326' },
      };
      const layer = LayerFactory.newWmsLayer(def);
      const source: TileWMS = layer.getSource() as TileWMS;
      expect(source).toBeInstanceOf(TileWMS);
      expect(source.getUrls()).toEqual(['http://test-url']);
      expect(source.getParams()).toEqual({ LAYERS: 'test-layer-name', TILED: true });
      expect(source.getTileLoadFunction().toString()).not.toContain('URL.createObjectURL');
    });

    it('without correct authentication', () => {
      const def: WmsDefinition = {
        url: 'http://test-url',
        layerName: 'test-layer-name',
        projection: { name: 'EPSG:4326' },
        auth: {
          username: '',
          password: '',
        },
      };
      const layer = LayerFactory.newWmsLayer(def);
      const source: TileWMS = layer.getSource() as TileWMS;
      expect(source.getTileLoadFunction().toString()).not.toContain('URL.createObjectURL');
    });

    it('with authentication', () => {
      const def: WmsDefinition = {
        url: 'http://test-url',
        layerName: 'test-layer-name',
        projection: { name: 'EPSG:4326' },
        auth: {
          username: 'test-username',
          password: 'test-password',
        },
      };
      const layer = LayerFactory.newWmsLayer(def);
      const source: TileWMS = layer.getSource() as TileWMS;
      expect(source).toBeInstanceOf(TileWMS);
      expect(source.getUrls()).toEqual(['http://test-url']);
      expect(source.getParams()).toEqual({ LAYERS: 'test-layer-name', TILED: true });
      expect(source.getTileLoadFunction().toString()).toContain('URL.createObjectURL');
    });
  });

  describe('olLayerToAbcLayer()', () => {
    it('with OSM layer', async () => {
      const layer = LayerFactory.newOsmLayer();
      layer.setVisible(false);
      layer.setOpacity(0.5);
      layer.set(LayerProperties.Active, true);

      const value = await LayerFactory.olLayerToAbcLayer(layer);
      expect(value.type).toEqual(LayerType.Predefined);

      const expectedMetadata: LayerMetadata = {
        id: layer.get(LayerProperties.Id),
        type: LayerType.Predefined,
        name: 'OpenStreetMap',
        active: true,
        opacity: 0.5,
        visible: false,
        model: PredefinedLayerModel.OSM,
      };
      expect(value.metadata).toEqual(expectedMetadata);
    });

    it('with vector layer', async () => {
      const vectorSource = new VectorSource({ features: TestHelper.sampleFeatures() });
      const layer = LayerFactory.newVectorLayer(vectorSource);
      layer.setVisible(false);
      layer.setOpacity(0.5);
      layer.set(LayerProperties.Active, true);

      const value: AbcVectorLayer = (await LayerFactory.olLayerToAbcLayer(layer)) as AbcVectorLayer;
      expect(value.type).toEqual(LayerType.Vector);

      const expectedMetadata: LayerMetadata = {
        id: layer.get(LayerProperties.Id),
        type: LayerType.Vector,
        name: 'Formes',
        active: true,
        opacity: 0.5,
        visible: false,
      };
      expect(value.metadata).toEqual(expectedMetadata);

      expect(value.features).toBeDefined();
      expect(value.features.features.length).toEqual(3);
      expect(value.features.features[0].geometry.type).toEqual('Point');
    });
  });

  describe('abcLayerToOlLayer()', () => {
    it('with OSM layer', () => {
      const abcLayer = TestHelper.sampleOsmLayer();
      abcLayer.metadata.opacity = 0.5;
      abcLayer.metadata.active = true;
      abcLayer.metadata.visible = false;

      const result = LayerFactory.abcLayerToOlLayer(abcLayer);
      expect(E.isRight(result)).toBeTruthy();

      const olLayer: TileLayer = (result as E.Right<BaseLayer>).right as TileLayer;
      expect(olLayer).toBeInstanceOf(TileLayer);

      const metadata = LayerMetadataHelper.getPredefinedMetadata(olLayer);
      expect(metadata).toEqual(abcLayer.metadata);
    });

    it('with vector layer', () => {
      const layer = TestHelper.sampleVectorLayer();
      layer.metadata.opacity = 0.5;
      layer.metadata.active = true;
      layer.metadata.visible = false;

      const olLayer = LayerFactory.abcLayerToOlLayer(layer);
      expect(E.isRight(olLayer)).toBeTruthy();

      const value: VectorLayer = (olLayer as E.Right<BaseLayer>).right as VectorLayer;
      expect(value).toBeInstanceOf(VectorLayer);

      const metadata: LayerMetadata = {
        id: value.get(LayerProperties.Id),
        type: LayerType.Vector,
        name: 'Vecteurs',
        active: true,
        opacity: 0.5,
        visible: false,
      };
      expect(metadata).toEqual(layer.metadata);

      expect(value.getSource().getFeatures()).toHaveLength(1);
      expect(value.getSource().getFeatures()[0].getGeometry()?.getType()).toEqual('Point');
    });
  });
});
