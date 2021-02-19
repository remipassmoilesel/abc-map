import TileLayer from 'ol/layer/Tile';
import { OSM, TileWMS } from 'ol/source';
import uuid from 'uuid-random';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { VectorStyles } from '../style/VectorStyles';
import { tileLoadAuthenticated } from '../map/tileLoadAuthenticated';
import { GeoJSON } from 'ol/format';
import { AbcLayer, LayerType, PredefinedLayerModel, PredefinedMetadata, VectorMetadata, WmsDefinition, WmsMetadata } from '@abc-map/shared-entities';
import { LayerWrapper } from './LayerWrapper';

export class LayerFactory {
  public static newOsmLayer(): LayerWrapper<TileLayer, PredefinedMetadata> {
    const layer = new TileLayer({
      source: new OSM(),
    });

    const metadata: PredefinedMetadata = {
      id: uuid(),
      name: 'OpenStreetMap',
      type: LayerType.Predefined,
      active: false,
      opacity: 1,
      visible: true,
      model: PredefinedLayerModel.OSM,
    };

    return LayerWrapper.from<TileLayer, PredefinedMetadata>(layer).setMetadata(metadata);
  }

  public static newVectorLayer(source?: VectorSource): LayerWrapper<VectorLayer, VectorMetadata> {
    const styleFunc = VectorStyles.openLayersStyleFunction();
    const _source = source || new VectorSource();
    const layer = new VectorLayer({ source: _source, style: styleFunc });

    const metadata: VectorMetadata = {
      id: uuid(),
      name: 'Formes',
      type: LayerType.Vector,
      active: false,
      opacity: 1,
      visible: true,
    };

    return LayerWrapper.from<VectorLayer, VectorMetadata>(layer).setMetadata(metadata);
  }

  public static newWmsLayer(def: WmsDefinition): LayerWrapper<TileLayer, WmsMetadata> {
    const tileLoadFunction = def.auth?.username && def.auth?.password ? tileLoadAuthenticated(def.auth) : undefined;

    // TODO: FIXME: which extent should we set ?
    const layer = new TileLayer({
      source: new TileWMS({
        url: def.remoteUrl,
        params: { LAYERS: def.remoteLayerName, TILED: true },
        tileLoadFunction,
        projection: def.projection?.name,
      }),
    });

    const metadata: WmsMetadata = {
      id: uuid(),
      name: def.remoteLayerName,
      type: LayerType.Wms,
      active: false,
      opacity: 1,
      visible: true,
      remoteUrl: def.remoteUrl,
      remoteLayerName: def.remoteLayerName,
      projection: def.projection,
      extent: def.extent,
      auth: def.auth,
    };

    return LayerWrapper.from<TileLayer, WmsMetadata>(layer).setMetadata(metadata);
  }

  public static async fromAbcLayer(abcLayer: AbcLayer): Promise<LayerWrapper> {
    let layer: LayerWrapper | undefined;

    // Predefined layer
    if (LayerType.Predefined === abcLayer.type) {
      if (PredefinedLayerModel.OSM === abcLayer.metadata.model) {
        layer = this.newOsmLayer();
        layer.setMetadata(abcLayer.metadata);
      } else {
        return Promise.reject(new Error(`Unhandled predefined layer type: ${abcLayer.type}`));
      }
    }

    // Vector layer
    else if (LayerType.Vector === abcLayer.type) {
      const geoJson = new GeoJSON();
      const source = new VectorSource({
        features: geoJson.readFeatures(abcLayer.features),
      });
      layer = this.newVectorLayer(source);
      layer.setMetadata(abcLayer.metadata);
    }

    // Wms layer
    else if (LayerType.Wms === abcLayer.type) {
      layer = this.newWmsLayer(abcLayer.metadata);
      layer.setMetadata(abcLayer.metadata);
    }

    if (!layer) {
      return Promise.reject(new Error(`Unhandled layer type: ${(abcLayer as AbcLayer).type}`));
    }

    return layer;
  }
}
