import Vue from 'vue';
import Component from "vue-class-component";
import * as L from 'leaflet';
import * as _ from 'lodash';
import {MainStore} from "../../lib/store/store";
import {AbstractMapLayer} from "../../../api/entities/AbstractMapLayer";
import './style.scss'
import {LeafletLayerFactory} from "../../lib/LeafletLayerFactory";

let mapIdCounter = 0;
const layerFactory = new LeafletLayerFactory();

@Component({
    template: require('./template.html')
})
export default class GeoMapComponent extends Vue {

    public $store: MainStore;

    public mapId = `map-${mapIdCounter++}`;
    public height: number = 500;
    private map: L.Map;

    public mounted() {
        this.height = this.getMaximumHeight();
        this.map = L.map(this.mapId).setView([45.18, 5.72], 13);
    }

    public updated() {

        console.log(' public updated() {');

        const layers = this.getLayers();

        // TODO improve
        this.map.eachLayer((layer) => {
            this.map.removeLayer(layer);
        });

        _.forEach(layers, (layer) => {
            this.map.addLayer(layerFactory.getLeafletLayer(layer));
        });

    }

    private getLayers(): AbstractMapLayer[] {
        return this.$store.getters.projectLayers;
    }

    private getMaximumHeight(): number {
        return (document.querySelector('.geo-map').parentNode as any).clientHeight - 100;
    }
}
