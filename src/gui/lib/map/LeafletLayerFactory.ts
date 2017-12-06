import * as L from 'leaflet';
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import {TileLayer} from "../../../api/entities/layers/TileLayer";
import {GeoJsonLayer} from "../../../api/entities/layers/GeoJsonLayer";
import {Clients} from "../clients/Clients";

export class LeafletLayerFactory {

    private clients: Clients;

    constructor(clients: Clients) {
        this.clients = clients;
    }

    public getLeafletLayer(layer: AbstractMapLayer): Promise<L.Layer> {

        if (layer instanceof TileLayer) {
            return Promise.resolve(L.tileLayer(layer.url));
        }

        else if (layer instanceof GeoJsonLayer) {

            return this.clients.map.getDataForLayer().then((data: any) => {
                return L.geoJSON(data); // TODO: better types
            });

        } else {
            throw new Error(`Unknown layer type: ${JSON.stringify(layer)}`);
        }
    }

}