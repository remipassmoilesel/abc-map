import { LayerFactory } from './LayerFactory';
import { AbcProperties, LayerProperties, PredefinedLayerProperties } from '@abc-map/shared-entities';
import { AbcLayer, AbcLayerMetadata, AbcPredefinedLayer, AbcVectorLayer, LayerType, PredefinedLayerModel } from '@abc-map/shared-entities';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import * as E from 'fp-ts/Either';
import { TestHelper } from '../utils/TestHelper';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';

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

  it('newVectorLayer() with source', () => {
    const source = new VectorSource();
    const layer = LayerFactory.newVectorLayer(source);
    expect(layer.get(AbcProperties.Managed)).toBe(true);
    expect(layer.get(LayerProperties.Id)).toBeDefined();
    expect(layer.get(LayerProperties.Name)).toBeDefined();
    expect(layer.get(LayerProperties.Type)).toEqual(LayerType.Vector);
    expect(layer.get(LayerProperties.Active)).toEqual(false);

    expect(layer.getSource()).toEqual(source);
  });

  it('newVectorLayer() without source', () => {
    const layer = LayerFactory.newVectorLayer();
    expect(layer.get(AbcProperties.Managed)).toBe(true);
    expect(layer.get(LayerProperties.Id)).toBeDefined();
    expect(layer.get(LayerProperties.Name)).toBeDefined();
    expect(layer.get(LayerProperties.Type)).toEqual(LayerType.Vector);
    expect(layer.get(LayerProperties.Active)).toEqual(false);

    expect(layer.getSource()).toBeDefined();
  });

  it('getMetadataFromLayer() on non managed layer', () => {
    const layer = new VectorLayer();
    const metadata = LayerFactory.getMetadataFromLayer(layer);
    expect(metadata).toBeUndefined();
  });

  it('getMetadataFromLayer()', () => {
    const layer = LayerFactory.newVectorLayer(new VectorSource());
    layer.set(LayerProperties.Active, true);
    layer.setVisible(false);
    layer.setOpacity(0.5);

    const metadata = LayerFactory.getMetadataFromLayer(layer);
    expect(metadata?.id).toBeDefined();

    expect(metadata?.id).toEqual(layer.get(LayerProperties.Id));
    expect(metadata?.type).toEqual(LayerType.Vector);
    expect(metadata?.opacity).toEqual(0.5);
    expect(metadata?.visible).toEqual(false);
    expect(metadata?.active).toEqual(true);
    expect(metadata?.type).toEqual(LayerType.Vector);
  });

  describe('olLayerToAbcLayer()', () => {
    it('with OSM layer', () => {
      const layer = LayerFactory.newOsmLayer();
      layer.setVisible(false);
      layer.setOpacity(0.5);
      layer.set(LayerProperties.Active, true);

      const abcLayer = LayerFactory.olLayerToAbcLayer(layer);
      expect(E.isRight(abcLayer)).toBeTruthy();

      const value: AbcPredefinedLayer = (abcLayer as E.Right<AbcLayer>).right as AbcPredefinedLayer;
      expect(value.type).toEqual(LayerType.Predefined);

      const expectedMetadata: AbcLayerMetadata = {
        id: layer.get(LayerProperties.Id),
        type: LayerType.Predefined,
        name: 'OpenStreetMap',
        active: true,
        opacity: 0.5,
        visible: false,
      };
      expect(value.metadata).toEqual(expectedMetadata);

      expect(value.model).toEqual(PredefinedLayerModel.OSM);
    });

    it('with vector layer', () => {
      const vectorSource = new VectorSource({ features: TestHelper.sampleFeatures() });
      const layer = LayerFactory.newVectorLayer(vectorSource);
      layer.setVisible(false);
      layer.setOpacity(0.5);
      layer.set(LayerProperties.Active, true);

      const abcLayer = LayerFactory.olLayerToAbcLayer(layer);
      expect(E.isRight(abcLayer)).toBeTruthy();

      const value: AbcVectorLayer = (abcLayer as E.Right<AbcLayer>).right as AbcVectorLayer;
      expect(value.type).toEqual(LayerType.Vector);

      const expectedMetadata: AbcLayerMetadata = {
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
      const layer = TestHelper.sampleOsmLayer();
      layer.metadata.opacity = 0.5;
      layer.metadata.active = true;
      layer.metadata.visible = false;

      const olLayer = LayerFactory.abcLayerToOlLayer(layer);
      expect(E.isRight(olLayer)).toBeTruthy();

      const value: TileLayer = (olLayer as E.Right<BaseLayer>).right as TileLayer;
      expect(value).toBeInstanceOf(TileLayer);

      const metadata: AbcLayerMetadata = {
        id: value.get(LayerProperties.Id),
        type: LayerType.Predefined,
        name: 'OpenStreetMap',
        active: true,
        opacity: 0.5,
        visible: false,
      };
      expect(metadata).toEqual(layer.metadata);

      expect(value.get(PredefinedLayerProperties.Model)).toEqual(PredefinedLayerModel.OSM);
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

      const metadata: AbcLayerMetadata = {
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
