import * as uuid from 'uuid';
import * as _ from 'lodash';
import {IPredefinedLayer, IVectorLayer, IWmsLayer, MapLayerType, PredefinedLayerPreset, IWmsParams} from './IMapLayer';
import {PredefinedLayers} from './PredefinedLayers';
import {FeatureCollection} from 'geojson';

export class LayerHelper {

    public static newPredefinedLayer(preset: PredefinedLayerPreset) {
        const layer = _.find(PredefinedLayers.ALL, (value) => value.preset === preset);
        if (!layer) {
            throw new Error(`Not found: ${preset}`);
        }
        const newLayer: IPredefinedLayer = _.cloneDeep(layer);
        newLayer.id = this.generateLayerId(layer.type);
        return newLayer;
    }

    public static newVectorLayer(layerName?: string, featureCollection?: FeatureCollection): IVectorLayer {
        if (!layerName) {
            layerName = 'Couche de dessin';
        }

        if (!featureCollection) {
            featureCollection = {
                type: 'FeatureCollection',
                features: [],
            };
        }

        return {
            id: this.generateLayerId(MapLayerType.Vector),
            type: MapLayerType.Vector,
            name: layerName,
            featureCollection,
        };
    }

    public static newWmsLayer(url: string, wmsParams: IWmsParams): IWmsLayer {
        return {
            id: this.generateLayerId(MapLayerType.Wms),
            name: 'Fond de carte ' + url,
            type: MapLayerType.Wms,
            url,
            wmsParams,
        };
    }

    public static generateLayerId(layerType: MapLayerType): string {
        return `${layerType}-${uuid.v4()}`.toLocaleLowerCase();
    }

}
