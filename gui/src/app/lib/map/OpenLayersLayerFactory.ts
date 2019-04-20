import {IMapLayer, IPredefinedLayer, IRasterLayer, IVectorLayer, MapLayerType, PredefinedLayerPreset} from 'abcmap-shared';
import {OlLayer, OlOSM, OlTile, OlTileWMS, OlVectorLayer, OlVectorSource} from '../OpenLayersImports';
import GeoJSON from 'ol/format/GeoJSON';
import {abcStyleToOlStyle} from './AbcStyles';
import {OpenLayersHelper} from './OpenLayersHelper';


export class OpenLayersLayerFactory {

  private static geoJson = new GeoJSON();

  public static toOlLayer(abcLayer: IMapLayer): OlLayer {
    let olLayer: OlLayer;
    switch (abcLayer.type) {
      case MapLayerType.Predefined:
        olLayer = this.toPredefinedLayer(abcLayer as IPredefinedLayer);
        break;
      case MapLayerType.Raster:
        olLayer = this.toRasterLayer(abcLayer as IRasterLayer);
        break;
      case MapLayerType.Vector:
        olLayer = this.toVectorLayer(abcLayer as IVectorLayer);
        break;
      default:
        throw new Error('Unknown: ' + abcLayer);
    }

    OpenLayersHelper.setLayerId(olLayer, abcLayer.id);
    return olLayer;
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
    if (abcLayer.featureCollection && abcLayer.featureCollection.type) {
      source.addFeatures(this.geoJson.readFeatures(abcLayer.featureCollection));
    }

    OpenLayersHelper.setLayerId(source, abcLayer.id); // layer id is set here for sourceChangedListeners

    return new OlVectorLayer({
      source,
      style: abcStyleToOlStyle
    });
  }

}
