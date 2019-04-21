import * as uuid from 'uuid';
import * as _ from 'lodash';
import {IPredefinedLayer, IVectorLayer, IWmsLayer, MapLayerType, PredefinedLayerPreset, WmsParams} from './IMapLayer';
import {PredefinedLayers} from './PredefinedLayers';

export class LayerHelper {

    public static newPredefinedLayer(preset: PredefinedLayerPreset) {
        const layer = _.find(PredefinedLayers.ALL, value => value.preset === preset);
        if (!layer) {
            throw new Error(`Not found: ${preset}`);
        }
        const newLayer: IPredefinedLayer = _.cloneDeep(layer);
        newLayer.id = this.generateLayerId(layer.type);
        return newLayer;
    }

    public static newVectorLayer(): IVectorLayer {
        return {
            id: this.generateLayerId(MapLayerType.Vector),
            type: MapLayerType.Vector,
            name: 'Couche de dessin',
            featureCollection: {
                type: 'FeatureCollection',
                features: []
            }
        };
    }

    public static newWmsLayer(url: string, wmsParams: WmsParams): IWmsLayer {
        return {
            id: this.generateLayerId(MapLayerType.Wms),
            name: 'Fond de carte ' + url,
            type: MapLayerType.Wms,
            url,
            wmsParams
        };
    }

    public static generateLayerId(layerType: MapLayerType): string {
        return `${layerType}-${uuid.v4()}`.toLocaleLowerCase();
    }

}
