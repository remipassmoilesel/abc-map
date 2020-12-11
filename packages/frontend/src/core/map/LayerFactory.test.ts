import { LayerFactory } from './LayerFactory';
import { AbcProperties, LayerProperties, PredefinedLayerProperties } from './AbcProperties';
import { AbcLayer, AbcPredefinedLayer, AbcVectorLayer, LayerType, PredefinedLayerModel } from '@abc-map/shared-entities';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import * as E from 'fp-ts/Either';
import { TestHelper } from '../utils/TestHelper';

describe('LayerFactory', () => {
  it('newOsmLayer()', () => {
    const layer = LayerFactory.newOsmLayer();
    expect(layer.get(AbcProperties.Managed)).toBe(true);
    expect(layer.get(LayerProperties.Id)).toBeDefined();
    expect(layer.get(LayerProperties.Name)).toEqual('OpenStreetMap');
    expect(layer.get(LayerProperties.Type)).toEqual(LayerType.Predefined);
    expect(layer.get(PredefinedLayerProperties.Model)).toEqual(PredefinedLayerModel.OSM);
  });

  it('newVectorLayer()', () => {
    const source = new VectorSource();
    const layer = LayerFactory.newVectorLayer(source);
    expect(layer.get(AbcProperties.Managed)).toBe(true);
    expect(layer.get(LayerProperties.Id)).toBeDefined();
    expect(layer.get(LayerProperties.Name)).toEqual('Vecteurs');
    expect(layer.get(LayerProperties.Type)).toEqual(LayerType.Vector);

    expect(layer.getSource()).toEqual(source);
  });

  it('getMetadataFromLayer() on non managed layer', () => {
    const layer = new VectorLayer();
    const metadata = LayerFactory.getMetadataFromLayer(layer);
    expect(metadata).toBeUndefined();
  });

  it('getMetadataFromLayer()', () => {
    const layer = LayerFactory.newVectorLayer(new VectorSource());
    layer.setVisible(false);
    layer.setOpacity(0.5);

    const metadata = LayerFactory.getMetadataFromLayer(layer);
    expect(metadata?.id).toBeDefined();
    expect(metadata?.opacity).toBeDefined();
    expect(metadata?.type).toBeDefined();
    expect(metadata?.visible).toBeDefined();

    expect(metadata?.id).toEqual(layer.get(LayerProperties.Id));
    expect(metadata?.opacity).toEqual(0.5);
    expect(metadata?.visible).toEqual(false);
    expect(metadata?.type).toEqual(LayerType.Vector);
  });

  describe('olLayerToAbcLayer()', () => {
    it('with OSM layer', () => {
      const layer = LayerFactory.newOsmLayer();
      layer.setVisible(false);
      layer.setOpacity(0.5);

      const abcLayer = LayerFactory.olLayerToAbcLayer(layer);
      expect(E.isRight(abcLayer)).toBeTruthy();

      const value: AbcPredefinedLayer = (abcLayer as E.Right<AbcLayer>).right as AbcPredefinedLayer;
      expect(value.type).toEqual(LayerType.Predefined);
      expect(value.metadata.id).toBeDefined();
      expect(value.metadata.id).toEqual(layer.get(LayerProperties.Id));
      expect(value.metadata.opacity).toEqual(0.5);
      expect(value.metadata.visible).toEqual(false);
      expect(value.metadata.name).toEqual('OpenStreetMap');

      expect(value.model).toEqual(PredefinedLayerModel.OSM);
    });

    // TODO: improve tests
    it('with vector layer', () => {
      const vectorSource = new VectorSource({ features: TestHelper.sampleFeatures() });
      const layer = LayerFactory.newVectorLayer(vectorSource);
      layer.setVisible(false);
      layer.setOpacity(0.5);

      const abcLayer = LayerFactory.olLayerToAbcLayer(layer);
      expect(E.isRight(abcLayer)).toBeTruthy();

      const value: AbcVectorLayer = (abcLayer as E.Right<AbcLayer>).right as AbcVectorLayer;
      expect(value.type).toEqual(LayerType.Vector);
      expect(value.metadata.id).toBeDefined();
      expect(value.metadata.id).toEqual(layer.get(LayerProperties.Id));
      expect(value.metadata.opacity).toEqual(0.5);
      expect(value.metadata.visible).toEqual(false);
      expect(value.metadata.name).toEqual('Vecteurs');

      expect(value.features).toBeDefined();
      expect(value.features.features.length).toEqual(3);
      expect(value.features.features[0].geometry.type).toEqual('Point');
    });
  });
});
