import {
  IMapLayer,
  IPredefinedLayer,
  IRasterLayer,
  IVectorLayer,
  MapLayerType,
  PredefinedLayerPreset
} from 'abcmap-shared';
import {OlLayer, OlOSM, OlTile, OlTileWMS, OlVectorLayer, OlVectorSource} from '../OpenLayers';
import {OpenLayersHelper} from './OpenLayersHelper';
import GeoJSON from 'ol/format/GeoJSON';


export class OpenLayersLayerFactory {

  private static geoJson = new GeoJSON();

  public static toOlLayer(abcLayer: IMapLayer): OlLayer {
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

  private static toPredefinedLayer(abcLayer: IPredefinedLayer): OlTile {
    switch (abcLayer.preset) {
      case PredefinedLayerPreset.OSM:
        return new OlTile({
          source: new OlOSM()
        });
      default:
        throw new Error('Unknown: ' + abcLayer);
    }
  }

  private static toRasterLayer(abcLayer: IRasterLayer): OlTile {
    return new OlTile({
      source: new OlTileWMS({
        url: abcLayer.url,
        params: {}
      })
    });
  }

  private static toVectorLayer(abcLayer: IVectorLayer): OlVectorLayer {
    const source = new OlVectorSource({wrapX: false});
    OpenLayersHelper.setLayerId(source, abcLayer.id);
    if(abcLayer.featureCollection && abcLayer.featureCollection.type){
      source.addFeatures(this.geoJson.readFeatures(abcLayer.featureCollection));
    }

    return new OlVectorLayer({
      source
    });
  }

}
