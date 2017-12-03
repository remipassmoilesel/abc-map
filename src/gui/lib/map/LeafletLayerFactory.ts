import * as L from 'leaflet';
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import {TileLayer} from "../../../api/entities/layers/TileLayer";
import {GeoJsonLayer} from "../../../api/entities/layers/GeoJsonLayer";

export class LeafletLayerFactory {

    public getLeafletLayer(layer: AbstractMapLayer): L.Layer {
        if (layer instanceof TileLayer) {
            return L.tileLayer(layer.url);
        } else if (layer instanceof GeoJsonLayer) {
            return L.geoJSON(layer.data);
        } else {
            throw new Error(`Unknown layer type: ${JSON.stringify(layer)}`);
        }
    }

}