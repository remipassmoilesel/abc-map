import {
  IMapLayer,
  IPredefinedLayer,
  IRasterLayer,
  IVectorLayer,
  MapLayerType,
  PredefinedLayerPreset
} from 'abcmap-shared';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Layer from 'ol/layer/Layer';

export class OpenLayersLayerFactory {

  public static toOlLayer(abcLayer: IMapLayer): Layer {
    switch (abcLayer.type) {
      case MapLayerType.Predefined:
        return this.toPredefinedLayer(abcLayer as IPredefinedLayer);
      case MapLayerType.Raster:
        return this.toRasterLayer(abcLayer as IRasterLayer);
      case MapLayerType.Vector:
        return this.toVectorLayer(abcLayer as IVectorLayer);
      default:
        throw new Error('Unknown: ' + abcLayer);
    }
  }

  private static toPredefinedLayer(abcLayer: IPredefinedLayer): Tile {
    switch (abcLayer.preset) {
      case PredefinedLayerPreset.OSM:
        return new Tile({
          source: new OSM()
        });
      default:
        throw new Error('Unknown: ' + abcLayer);
    }
  }

  private static toRasterLayer(abcLayer: IRasterLayer): Tile {
    return new Tile({
      source: new TileWMS({
        url: abcLayer.url,
        params: {}
      })
    });
  }

  private static toVectorLayer(abcLayer: IVectorLayer): VectorLayer {
    return new VectorLayer({
      source: new VectorSource({wrapX: false})
    });
  }

}
