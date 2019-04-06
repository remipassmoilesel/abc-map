import {IPredefinedLayer, MapLayerType} from "abcmap-shared/dist/project/IMapLayer";
import * as uuid from 'uuid';
import * as _ from 'lodash';

export class LayerHelper {

    public static newPredefinedLayer(layer: IPredefinedLayer) {
        const newLayer: IPredefinedLayer = _.cloneDeep(layer);
        newLayer.id = this.generateLayerId(layer.type);
        return newLayer;
    }

    public static generateLayerId(layerType: MapLayerType): string {
        return `${layerType}-${uuid.v4()}`.toLocaleLowerCase();
    }
}
