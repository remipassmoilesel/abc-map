import {
  IMapLayer,
  IPredefinedLayer,
  IRasterLayer,
  IVectorLayer,
  MapLayerType,
  PredefinedLayerPreset
} from 'abcmap-shared';
import * as ol from "openlayers";

export class OpenLayerFactory {

  public static toOlLayer(abcLayer: IMapLayer) {
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

  private static toPredefinedLayer(abcLayer: IPredefinedLayer): ol.layer.Base {
    switch (abcLayer.preset) {
      case PredefinedLayerPreset.OSM:
        return new ol.layer.Tile({
          source: new ol.source.OSM()
        });
      default:
        throw new Error('Unknown: ' + abcLayer);
    }
  }

  private static toRasterLayer(abcLayer: IRasterLayer): ol.layer.Base {
    return new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: abcLayer.url,
        params: {}
      })
    });
  }

  private static toVectorLayer(abcLayer: IVectorLayer): ol.layer.Vector {
    return new ol.layer.Vector({
      source: new ol.source.Vector({wrapX: false})
    });
  }

}
