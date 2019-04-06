import {IPredefinedLayer, IVectorLayer, MapLayerType} from "abcmap-shared";
import * as uuid from 'uuid';
import * as _ from 'lodash';

export class LayerHelper {

    static newPredefinedLayer(layer: IPredefinedLayer) {
        const newLayer: IPredefinedLayer = _.cloneDeep(layer);
        newLayer.id = this.generateLayerId(layer.type);
        return newLayer;
    }

    static generateLayerId(layerType: MapLayerType): string {
        return `${layerType}-${uuid.v4()}`.toLocaleLowerCase();
    }

    static newVectorLayer(): IVectorLayer {
        return {
            id: this.generateLayerId(MapLayerType.Vector),
            type: MapLayerType.Vector,
            name: 'Couche de dessin'
        };
    }
}
