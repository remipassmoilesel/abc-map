import { LayerFactory } from './LayerFactory';
import VectorSource from 'ol/source/Vector';
import { TileWMS } from 'ol/source';
import { AbcProperties, LayerType, PredefinedLayerModel, WmsDefinition, WmsMetadata } from '@abc-map/shared-entities';
import { TestHelper } from '../../utils/TestHelper';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { LayerWrapper } from './LayerWrapper';

describe('LayerFactory', () => {
  it('newOsmLayer()', () => {
    const layer = LayerFactory.newOsmLayer();
    const metadata = layer.getMetadata();
    expect(metadata).toBeDefined();
    expect(metadata?.id).toBeDefined();
    expect(metadata?.name).toEqual('OpenStreetMap');
    expect(metadata?.opacity).toEqual(1);
    expect(metadata?.visible).toEqual(true);
    expect(metadata?.active).toEqual(false);
    expect(metadata?.type).toEqual(LayerType.Predefined);
    expect(metadata?.model).toEqual(PredefinedLayerModel.OSM);
    expect(layer.unwrap().get(AbcProperties.Managed)).toBe(true);
    expect(layer.unwrap()).toBeInstanceOf(TileLayer);
  });

  describe('newVectorLayer()', () => {
    it('without source', () => {
      const layer = LayerFactory.newVectorLayer();
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('Formes');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Vector);
      expect(layer.unwrap().get(AbcProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(VectorLayer);
    });

    it('with source', () => {
      const source = new VectorSource();
      const layer = LayerFactory.newVectorLayer(source);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.name).toEqual('Formes');
      expect(metadata?.opacity).toEqual(1);
      expect(metadata?.visible).toEqual(true);
      expect(metadata?.active).toEqual(false);
      expect(metadata?.type).toEqual(LayerType.Vector);
      expect(layer.unwrap().get(AbcProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(VectorLayer);
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
      expect(layer.unwrap().get(AbcProperties.Managed)).toBe(true);
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
      expect(layer.unwrap().get(AbcProperties.Managed)).toBe(true);
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
      expect(layer.unwrap().get(AbcProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
    });

    it('with vector layer', async () => {
      const abcLayer = TestHelper.sampleVectorLayer();
      abcLayer.metadata.name = 'Formes';
      abcLayer.metadata.opacity = 0.5;
      abcLayer.metadata.active = true;
      abcLayer.metadata.visible = false;

      const layer = await LayerFactory.fromAbcLayer(abcLayer);
      expect(layer.unwrap()).toBeInstanceOf(VectorLayer);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.id).toBeDefined();
      expect(metadata?.id).toEqual(abcLayer.metadata.id);
      expect(metadata?.name).toEqual('Formes');
      expect(metadata?.opacity).toEqual(0.5);
      expect(metadata?.visible).toEqual(false);
      expect(metadata?.active).toEqual(true);
      expect(metadata?.type).toEqual(LayerType.Vector);
      expect(layer.unwrap().get(AbcProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(VectorLayer);
    });

    it('with wms layer, without authentication', async () => {
      const abcLayer = TestHelper.sampleWmsLayer();
      abcLayer.metadata.auth = undefined;
      abcLayer.metadata.opacity = 0.5;
      abcLayer.metadata.active = true;
      abcLayer.metadata.visible = false;

      const layer = (await LayerFactory.fromAbcLayer(abcLayer)) as LayerWrapper<TileLayer, WmsMetadata>;

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
      expect(layer.unwrap().get(AbcProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
    });

    it('with wms layer, with authentication', async () => {
      const abcLayer = TestHelper.sampleWmsLayer();
      abcLayer.metadata.opacity = 0.5;
      abcLayer.metadata.active = true;
      abcLayer.metadata.visible = false;

      const layer = (await LayerFactory.fromAbcLayer(abcLayer)) as LayerWrapper<TileLayer, WmsMetadata>;

      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
      const metadata = layer.getMetadata();
      expect(metadata).toBeDefined();
      expect(metadata?.remoteUrl).toEqual('http://remote-url');
      expect(metadata?.remoteLayerName).toEqual('test-layer-name');
      expect(metadata?.extent).toEqual([1, 2, 3, 4]);
      expect(metadata?.auth?.username).toEqual('test-username');
      expect(metadata?.auth?.password).toEqual('test-password');
      expect(layer.unwrap().get(AbcProperties.Managed)).toBe(true);
      expect(layer.unwrap()).toBeInstanceOf(TileLayer);
    });
  });
});
