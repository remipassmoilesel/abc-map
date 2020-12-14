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
    layer.set(LayerProperties.Active, false);
    layer.set(PredefinedLayerProperties.Model, PredefinedLayerModel.OSM);
    return layer;
  }

  public static newVectorLayer(source?: VectorSource): VectorLayer {
    const _source = source || new VectorSource();
    const layer = new VectorLayer({ source: _source });
    layer.set(AbcProperties.Managed, true);
    layer.set(LayerProperties.Id, uuid.v4());
    layer.set(LayerProperties.Name, 'Formes');
    layer.set(LayerProperties.Type, LayerType.Vector);
    layer.set(LayerProperties.Active, false);
    return layer;
  }

  public static getMetadataFromLayer(layer: BaseLayer): AbcLayerMetadata | undefined {
    const id: string | undefined = layer.get(LayerProperties.Id);
    const name: string = layer.get(LayerProperties.Name) || '';
    const active: boolean = layer.get(LayerProperties.Active) || false;
    const type: LayerType = layer.get(LayerProperties.Type);
    if (!type || !id || !name) {
      return;
    }

    return {
      id,
      name,
      type,
      opacity: layer.getOpacity(),
      visible: layer.getVisible(),
      active,
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

  public static abcLayerToOlLayer(abcLayer: AbcLayer): E.Either<Error, BaseLayer> {
    let layer: BaseLayer | undefined;
    let error: Error | undefined;
    // Predefined layer
    if (LayerType.Predefined === abcLayer.type) {
      if (PredefinedLayerModel.OSM === abcLayer.model) {
        layer = this.newOsmLayer();
      } else {
        error = new Error(`Unhandled predefined layer type: ${abcLayer.type}`);
      }
    }
    // Vector layer
    else if (LayerType.Vector === abcLayer.type) {
      const geoJson = new GeoJSON();
      const source = new VectorSource({
        features: geoJson.readFeatures(abcLayer.features),
      });
      layer = this.newVectorLayer(source);
    }

    if (!layer) {
      return E.left(new Error(`Unhandled layer type: ${(abcLayer as AbcLayer).type}`));
    }

    if (error) {
      return E.left(error);
    }

    layer.set(LayerProperties.Id, abcLayer.metadata.id);
    layer.set(LayerProperties.Name, abcLayer.metadata.name);
    layer.set(LayerProperties.Active, abcLayer.metadata.active);
    layer.set(LayerProperties.Type, abcLayer.metadata.type);
    layer.setOpacity(abcLayer.metadata.opacity);
    layer.setVisible(abcLayer.metadata.visible);

    return E.right(layer);
  }
}
