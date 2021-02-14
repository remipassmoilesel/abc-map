import BaseLayer from 'ol/layer/Base';
import {
  AbcLayer,
  AbcWmsLayer,
  LayerType,
  PredefinedLayerModel,
  PredefinedMetadata,
  VectorMetadata,
  WmsDefinition,
  WmsMetadata,
} from '@abc-map/shared-entities';
import { LayerProperties } from '@abc-map/shared-entities';
import { GeoJSON } from 'ol/format';
import VectorLayer from 'ol/layer/Vector';
import * as E from 'fp-ts/Either';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import { OSM, TileWMS } from 'ol/source';
import * as uuid from 'uuid';
import { VectorStyles } from '../style/VectorStyles';
import { tileLoadAuthenticated } from './tileLoadAuthenticated';
import { Logger } from '../../utils/Logger';
import { LayerMetadataHelper } from './LayerMetadataHelper';
import { Encryption } from '../../utils/Encryption';

const logger = Logger.get('LayerFactory.ts');

export class LayerFactory {
  public static newOsmLayer(): TileLayer {
    const layer = new TileLayer({
      source: new OSM(),
    });

    const metadata: PredefinedMetadata = {
      id: uuid.v4(),
      name: 'OpenStreetMap',
      type: LayerType.Predefined,
      active: false,
      opacity: 1,
      visible: true,
      model: PredefinedLayerModel.OSM,
    };
    LayerMetadataHelper.setPredefinedMetadata(layer, metadata);

    return layer;
  }

  public static newVectorLayer(source?: VectorSource): VectorLayer {
    const styleFunc = VectorStyles.openLayersStyleFunction();
    const _source = source || new VectorSource();
    const layer = new VectorLayer({ source: _source, style: styleFunc });

    const metadata: VectorMetadata = {
      id: uuid.v4(),
      name: 'Formes',
      type: LayerType.Vector,
      active: false,
      opacity: 1,
      visible: true,
    };
    LayerMetadataHelper.setVectorMetadata(layer, metadata);

    return layer;
  }

  public static newWmsLayer(def: WmsDefinition): TileLayer {
    const tileLoadFunction = def.auth?.username && def.auth?.password ? tileLoadAuthenticated(def.auth) : undefined;
    // TODO: FIXME: which extent should we set ?
    const layer = new TileLayer({
      source: new TileWMS({
        url: def.url,
        params: { LAYERS: def.layerName, TILED: true },
        tileLoadFunction,
        projection: def.projection?.name,
      }),
    });

    const metadata: WmsMetadata = {
      id: uuid.v4(),
      name: def.layerName,
      type: LayerType.Wms,
      active: false,
      opacity: 1,
      visible: true,
      url: def.url,
      layerName: def.layerName,
      projection: def.projection,
      extent: def.extent,
      auth: def.auth,
    };
    LayerMetadataHelper.setWmsMetadata(layer, metadata);

    return layer;
  }

  // TODO: refactor
  public static async olLayerToAbcLayer(lay: BaseLayer, password?: string): Promise<AbcLayer> {
    const commonMeta = LayerMetadataHelper.getCommons(lay);
    if (!commonMeta) {
      return Promise.reject(new Error('Invalid layer'));
    }
    // Predefined layer
    if (LayerType.Predefined === commonMeta.type) {
      const meta = LayerMetadataHelper.getPredefinedMetadata(lay);
      if (!meta) {
        return Promise.reject(new Error('Invalid predefined layer'));
      }
      return {
        type: LayerType.Predefined,
        metadata: meta,
      };
    }
    // Vector layer
    else if (LayerType.Vector === commonMeta.type) {
      const meta = LayerMetadataHelper.getVectorMetadata(lay);
      if (!meta) {
        return Promise.reject(new Error('Invalid vector layer'));
      }
      const geoJson = new GeoJSON();
      const features = geoJson.writeFeaturesObject((lay as VectorLayer).getSource().getFeatures());
      return {
        type: LayerType.Vector,
        metadata: meta,
        features,
      };
    }

    // Wms Layer
    else if (LayerType.Wms === commonMeta.type) {
      const meta = LayerMetadataHelper.getWmsMetadata(lay);
      if (!meta) {
        return Promise.reject(new Error('Invalid wms layer'));
      }
      const result: AbcWmsLayer = {
        type: LayerType.Wms,
        metadata: meta,
      };
      if (result.metadata.auth?.username && result.metadata.auth?.password) {
        if (!password) {
          throw new Error('Master password is require when using credentials');
        }
        result.metadata = await Encryption.encryptWmsMetadata(result.metadata, password);
      }
      return result;
    }

    return Promise.reject(new Error(`Unhandled layer type: ${commonMeta.type}`));
  }

  // TODO: refactor
  public static abcLayerToOlLayer(abcLayer: AbcLayer): E.Either<Error, BaseLayer> {
    let layer: BaseLayer | undefined;
    let error: Error | undefined;

    // Predefined layer
    if (LayerType.Predefined === abcLayer.type) {
      if (PredefinedLayerModel.OSM === abcLayer.metadata.model) {
        layer = this.newOsmLayer();
        LayerMetadataHelper.setPredefinedMetadata(layer, abcLayer.metadata);
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
      LayerMetadataHelper.setVectorMetadata(layer as VectorLayer, abcLayer.metadata);
    }

    // Wms layer
    else if (LayerType.Wms === abcLayer.type) {
      layer = this.newWmsLayer(abcLayer.metadata);
      LayerMetadataHelper.setWmsMetadata(layer as TileLayer, abcLayer.metadata);
    }

    if (!layer) {
      return E.left(new Error(`Unhandled layer type: ${(abcLayer as AbcLayer).type}`));
    }

    if (error) {
      return E.left(error);
    }

    return E.right(layer);
  }

  public static setLayerName(layer: BaseLayer, value: string): void {
    layer.set(LayerProperties.Name, value);
  }
}
