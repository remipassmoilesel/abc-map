import {IMapLayer, IPredefinedLayer, IVectorLayer, IWmsLayer, MapLayerType, PredefinedLayerPreset} from 'abcmap-shared';
import {OlGeoJSON, OlLayer, OlOSM, OlTileLayer, OlTileWMS, OlVectorLayer, OlVectorSource} from '../OpenLayersImports';
import GeoJSON from 'ol/format/GeoJSON';
import {abcStyleRendering} from './abcStyleRendering';
import {OpenLayersHelper} from './OpenLayersHelper';


export class OlLayerFactory {

  private static geoJson = new GeoJSON();

  public static toOlLayer(abcLayer: IMapLayer): OlLayer {
    let olLayer: OlLayer;
    switch (abcLayer.type) {
      case MapLayerType.Predefined:
        olLayer = this.toPredefinedLayer(abcLayer as IPredefinedLayer);
        break;
      case MapLayerType.Wms:
        olLayer = this.toWmsLayer(abcLayer as IWmsLayer);
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

  public static newOsmLayer(): OlTileLayer {
    return new OlTileLayer({
      source: new OlOSM()
    });
  }

  private static toPredefinedLayer(abcLayer: IPredefinedLayer): OlTileLayer {
    switch (abcLayer.preset) {
      case PredefinedLayerPreset.OSM:
        return new OlTileLayer({
          source: new OlOSM()
        });
      default:
        throw new Error('Unknown: ' + abcLayer);
    }
  }

  private static toWmsLayer(abcLayer: IWmsLayer): OlTileLayer {
    return new OlTileLayer({
      source: new OlTileWMS({
        url: abcLayer.url,
        params: abcLayer.wmsParams
      })
    });
  }

  private static toVectorLayer(abcLayer: IVectorLayer): OlVectorLayer {
    const source = new OlVectorSource({
      wrapX: false,
      format: new OlGeoJSON()
    });

    if (abcLayer.featureCollection && abcLayer.featureCollection.type) {
      source.addFeatures(this.geoJson.readFeatures(abcLayer.featureCollection));
    }

    OpenLayersHelper.setLayerId(source, abcLayer.id); // layer id is set here for sourceChangedListeners

    return new OlVectorLayer({
      source,
      style: abcStyleRendering
    });
  }

}
