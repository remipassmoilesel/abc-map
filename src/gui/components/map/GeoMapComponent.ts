import Vue from 'vue';
import Component from "vue-class-component";
import * as L from 'leaflet';
import {FeatureGroup} from 'leaflet';
import * as _ from 'lodash';
import {MainStore} from "../../lib/store/store";
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import {LeafletLayerFactory} from "../../lib/LeafletLayerFactory";
import {MapView} from "./MapView";
import {Logger} from "../../../api/dev/Logger";
// Import style
import './style.scss'
// Import plugins
import 'leaflet-draw';

let mapIdCounter = 0;
const layerFactory = new LeafletLayerFactory();
const logger = Logger.getLogger('GeoMapComponent');

@Component({
    template: require('./template.html')
})
export default class GeoMapComponent extends Vue {

    public $store: MainStore;

    public mapId = `map-${mapIdCounter++}`;
    public height: number = 500;
    private map: L.Map;
    private editableLayersGroup: FeatureGroup<any>;

    public mounted() {
        this.height = this.getMaximumHeight();
        this.map = L.map(this.mapId).setView([45.18, 5.72], 13);
        this.setupDrawPlugin();
    }

    public updated() {

        // update layers
        this.updateMapLayers();

        // re-add editable group on top
        this.map.addLayer(this.editableLayersGroup);

        this.updateView();

    }

    private updateView() {
        const view = this.getCurrentView();
        if (view) {
            logger.info('Updating view: ' + view);
            this.map.panTo([view.latitude, view.longitude], {animate: true});
        }
    }

    private updateMapLayers() {
        const layers = this.getLayers();

        // TODO do not remove layers already present
        this.map.eachLayer((layer) => {
            this.map.removeLayer(layer);
        });

        _.forEach(layers, (layer) => {
            this.map.addLayer(layerFactory.getLeafletLayer(layer));
        });
    }

    private setupDrawPlugin() {

        // create an editable group to store shapes
        this.editableLayersGroup = new L.FeatureGroup();
        this.map.addLayer(this.editableLayersGroup);

        // See https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/leaflet-draw/leaflet-draw-tests.ts
        const options = {
            position: 'topright',
            draw: {
                polyline: {
                    shapeOptions: {
                        color: '#f357a1',
                        weight: 10
                    }
                },
                polygon: {
                    allowIntersection: false, // Restricts shapes to simple polygons
                    drawError: {
                        color: '#e1e100', // Color the shape will turn when intersects
                        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                    },
                    shapeOptions: {
                        color: '#bada55'
                    }
                },
                circle: {},
                rectangle: {},
                marker: {},
            },
            edit: {
                featureGroup: this.editableLayersGroup, //REQUIRED!!
                remove: true
            }
        };

        // add toolbar on tob of map
        const drawControl = new L.Control.Draw(options);
        this.map.addControl(drawControl);

        // listen for creation events
        this.map.on(L.Draw.Event.CREATED, this.onDrawCreated.bind(this));

    }

    private onDrawCreated(e: L.DrawEvents.Created) {
        const type = e.layerType;
        const layer = e.layer;

        if (type === 'marker') {
            // Do marker specific actions
        }

        // add created shapes to group of editable layers
        this.editableLayersGroup.addLayer(layer);

        // console.log(e);
    }

    private getCurrentView(): MapView {
        return this.$store.getters.mapView;
    }

    private getLayers(): AbstractMapLayer[] {
        return this.$store.getters.projectLayers;
    }

    private getMaximumHeight(): number {
        return (document.querySelector('.geo-map').parentNode as any).clientHeight - 100;
    }

}
