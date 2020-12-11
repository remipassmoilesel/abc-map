import BaseLayer from 'ol/layer/Base';
import { AbcLayer, AbcLayerMetadata, LayerType, PredefinedLayerModel } from '@abc-map/shared-entities';
import { AbcProperties, LayerProperties, PredefinedLayerProperties } from './AbcProperties';
import { GeoJSON } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';
import * as E from 'fp-ts/Either';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import * as uuid from 'uuid';

export class LayerFactory {
  public static newOsmLayer(): TileLayer {
    const layer = new TileLayer({
      source: new OSM(),
    });
    layer.set(AbcProperties.Managed, true);
    layer.set(LayerProperties.Id, uuid.v4());
    layer.set(LayerProperties.Name, 'OpenStreetMap');
    layer.set(LayerProperties.Type, LayerType.Predefined);
    layer.set(PredefinedLayerProperties.Model, PredefinedLayerModel.OSM);
    return layer;
  }

  public static newVectorLayer(source?: VectorSource): VectorLayer {
    const layer = new VectorLayer({ source });
    layer.set(AbcProperties.Managed, true);
    layer.set(LayerProperties.Id, uuid.v4());
    layer.set(LayerProperties.Name, 'Vecteurs');
    layer.set(LayerProperties.Type, LayerType.Vector);
    return layer;
  }

  public static getMetadataFromLayer(layer: BaseLayer): AbcLayerMetadata | undefined {
    const id: string = layer.get(LayerProperties.Id);
    const name: string = layer.get(LayerProperties.Name);
    const type: LayerType = layer.get(LayerProperties.Type);
    if (!type) {
      return;
    }

    return {
      id,
      name,
      type,
      opacity: layer.getOpacity(),
      visible: layer.getVisible(),
    };
  }

  public static olLayerToAbcLayer(lay: BaseLayer): E.Either<Error, AbcLayer> {
    const metadata = this.getMetadataFromLayer(lay);
    if (!metadata) {
      return E.left(new Error('Layer is not managed'));
    }
    // Predefined layer
    if (LayerType.Predefined === metadata.type) {
      const model: PredefinedLayerModel = lay.get(PredefinedLayerProperties.Model);
      if (!model) {
        return E.left(new Error('Predefined layer model not set'));
      }
      return E.right({
        type: LayerType.Predefined,
        metadata,
        model,
      });
    }
    // Vector layer
    else if (LayerType.Vector === metadata.type) {
      const geoJson = new GeoJSON();
      const features = geoJson.writeFeaturesObject((lay as VectorLayer).getSource().getFeatures());
      return E.right({
        type: LayerType.Vector,
        metadata,
        features,
      });
    }

    return E.left(new Error(`Unhandled layer type: ${metadata.type}`));
  }

  public static abcLayerToOlLayer(layer: AbcLayer): E.Either<Error, BaseLayer> {
    // Predefined layer
    if (LayerType.Predefined === layer.type) {
      if (PredefinedLayerModel.OSM === layer.model) {
        const result = this.newOsmLayer();
        result.set(LayerProperties.Id, layer.metadata.id);
        result.set(LayerProperties.Name, layer.metadata.name);
        result.setOpacity(layer.metadata.opacity);
        result.setVisible(layer.metadata.visible);
        return E.right(result);
      }
      return E.left(new Error(`Unhandled predefined layer type: ${layer.type}`));
    }
    // Vector layer
    else if (LayerType.Vector === layer.type) {
      const geoJson = new GeoJSON();
      const source = new VectorSource({
        features: geoJson.readFeatures(layer.features),
      });
      return E.right(this.newVectorLayer(source));
    }

    return E.left(new Error(`Unhandled layer type: ${(layer as AbcLayer).type}`));
  }
}
