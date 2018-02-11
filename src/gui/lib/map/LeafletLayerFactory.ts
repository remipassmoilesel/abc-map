import * as L from 'leaflet';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';
import {TileLayer} from '../../../api/entities/layers/TileLayer';
import {GeoJsonLayer} from '../../../api/entities/layers/GeoJsonLayer';
import {ClientGroup} from '../clients/ClientGroup';

export interface IExtendedLeafletLayer extends L.Layer {
    _abcmapId?: string;
}

export class LeafletLayerFactory {

    private clients: ClientGroup;

    constructor(clients: ClientGroup) {
        this.clients = clients;
    }

    public async getLeafletLayer(layer: AbstractMapLayer): Promise<IExtendedLeafletLayer> {
        const leafletLayer: L.Layer = await this.layerToLeafletLayer(layer);
        return this.extendLayer(leafletLayer, layer);
    }

    private layerToLeafletLayer(layer: AbstractMapLayer): Promise<L.Layer> {

        if (layer instanceof TileLayer) {
            return this.getTileLayer((layer as TileLayer));
        }

        if (layer instanceof GeoJsonLayer) {
            return this.getGeojsonLayer(layer);
        }

        throw new Error(`Unknown layer type: ${JSON.stringify(layer)}`);
    }

    private extendLayer(leafletLayer: L.Layer, abcLayer: AbstractMapLayer): IExtendedLeafletLayer {
        const res: IExtendedLeafletLayer = leafletLayer as IExtendedLeafletLayer;
        res._abcmapId = abcLayer.id;
        return res;
    }

    private getTileLayer(layer: TileLayer): Promise<L.Layer> {
        return Promise.resolve(L.tileLayer(layer.url));
    }

    private async getGeojsonLayer(layer: GeoJsonLayer): Promise<L.Layer> {
        // TODO: find a better type for data
        // TODO: poll data for area
        const data: any = await this.clients.map.getGeojsonDataForLayer(layer);
        return L.geoJSON(data);
    }
}
