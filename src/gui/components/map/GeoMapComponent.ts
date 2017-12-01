import Vue from 'vue';
import Component from "vue-class-component";
import * as L from 'leaflet';
import * as _ from 'lodash';
import {MainStore} from "../../lib/store/store";
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import {LeafletLayerFactory} from "../../lib/LeafletLayerFactory";
// Import style
import './style.scss'
// Import plugins
import 'leaflet-draw/dist/leaflet.draw.js';
import {FeatureGroup} from "leaflet";

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
    private editableLayers: FeatureGroup<any>;

    public mounted() {
        this.height = this.getMaximumHeight();
        this.map = L.map(this.mapId).setView([45.18, 5.72], 13);
        this.setupDraw();
    }

    public updated() {

        const layers = this.getLayers();

        // TODO improve
        this.map.eachLayer((layer) => {
            this.map.removeLayer(layer);
        });

        _.forEach(layers, (layer) => {
            this.map.addLayer(layerFactory.getLeafletLayer(layer));
        });

    }

    private setupDraw(){
        this.editableLayers = new L.FeatureGroup();
        this.map.addLayer(this.editableLayers);

        // var MyCustomMarker = L.Icon.extend({
        //     options: {
        //         shadowUrl: null,
        //         iconAnchor: new L.Point(12, 12),
        //         iconSize: new L.Point(24, 24),
        //         iconUrl: 'link/to/image.png'
        //     }
        // });

        var options = {
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
                circle: true, // Turns off this drawing tool
                rectangle: {
                    shapeOptions: {
                        clickable: false
                    }
                },
                // marker: {
                //     icon: new MyCustomMarker()
                // }
            },
            edit: {
                featureGroup: this.editableLayers, //REQUIRED!!
                remove: false
            }
        };

        const drawControl = new (L.Control as any).Draw(options);
        this.map.addControl(drawControl);

       // this. map.on(L.Draw.Event.CREATED, function (e) {
       //      var type = e.layerType,
       //          layer = e.layer;
       //
       //      if (type === 'marker') {
       //          layer.bindPopup('A popup!');
       //      }
       //
       //      this.editableLayers.addLayer(layer);
       //  });

    }

    private getLayers(): AbstractMapLayer[] {
        return this.$store.getters.projectLayers;
    }

    private getMaximumHeight(): number {
        return (document.querySelector('.geo-map').parentNode as any).clientHeight - 100;
    }
}
