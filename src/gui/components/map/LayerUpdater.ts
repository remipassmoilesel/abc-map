import * as _ from 'lodash';
import * as L from 'leaflet';
import {clients} from '../../lib/mixins';
import {IExtendedLeafletLayer, LeafletLayerFactory} from '../../lib/map/LeafletLayerFactory';
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
        const leafletLayers = this.getLeafletLayersFromMap();

        // compare layer ids, if they are different update layers,
        // otherwise do nothing

        const abcIds: string[] = _.map(abcLayers, (lay) => lay.id);
        const leafletIds = _.map(leafletLayers, (lay) => lay._abcmapId);

        if (_.difference(abcIds, leafletIds).length > 0) {
            this.updateMapLayers();
        }
    }

    private getLeafletLayersFromMap(): IExtendedLeafletLayer[] {
        const res: IExtendedLeafletLayer[] = [];
        // fetch only layers we add
        this.map.eachLayer((lay: IExtendedLeafletLayer) => {
            if (lay._abcmapId) {
                res.push(lay);
            }
        });
        return res;
    }

    private updateMapLayers() {

        const abcLayers: AbstractMapLayer[] = this.mapComponent.getLayers();

        // remove previous layers, only those added
        this.map.eachLayer((leafletLayer: IExtendedLeafletLayer) => {
            if (leafletLayer && leafletLayer._abcmapId) {
                this.map.removeLayer(leafletLayer);
            }
        });

        // re add layers
        _.forEach(abcLayers, async (layer) => {
            const leafletLayer: L.Layer = await this.layerFactory.getLeafletLayer(layer);
            this.map.addLayer(leafletLayer);
        });
    }
}
