import * as _ from 'lodash';
import * as L from 'leaflet';
import {clients} from '../../lib/mixins';
import {LeafletLayerFactory} from '../../lib/map/LeafletLayerFactory';
import {GeoMapComponent} from './GeoMapComponent';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';

export class LayerUpdater {
    private map: L.Map;
    private layerFactory: LeafletLayerFactory;
    private mapComponent: GeoMapComponent;

    constructor(map: L.Map, mapComponent: GeoMapComponent) {
        this.map = map;
        this.mapComponent = mapComponent;
        this.layerFactory = new LeafletLayerFactory(clients);
    }

    public async onMapComponentUpdated() {
        const abcLayers: AbstractMapLayer[] = this.mapComponent.getLayers();
        const leafletLayers = this.getLayersFromMap();

        // compare layer ids, if they are different update layers,
        // otherwise do nothing

        _.forEach(abcLayers, (abcLayer, index) => {
            const leafletLay = this.map;
        });

        // TODO do not remove layers already present
        this.map.eachLayer((leafletLayer) => {
            if (leafletLayer) {
                this.map.removeLayer(leafletLayer);
            }
        });

        _.forEach(abcLayers, async (layer) => {
            const leafletLayer: L.Layer = await this.layerFactory.getLeafletLayer(layer);
            this.map.addLayer(leafletLayer);
        });
    }

    private getLayersFromMap(): L.Layer[] {
        const res: L.Layer[] = [];
        this.map.eachLayer((lay) => res.push(lay));
        return res;
    }
}
