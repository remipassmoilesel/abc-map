import * as L from 'leaflet';
import {AbstractMapLayer} from "../../api/entities/layers/AbstractMapLayer";
import {TileLayer} from "../../api/entities/layers/TileLayer";

export class LeafletLayerFactory {

    public getLeafletLayer(layer: AbstractMapLayer): L.Layer {
        if (layer instanceof TileLayer) {
            return L.tileLayer(layer.url);
        } else {
            throw new Error(`Unknown layer type: ${JSON.stringify(layer)}`);
        }
    }

}