import Vue from 'vue';
import Component from "vue-class-component";
import * as L from 'leaflet';
import './style.scss'

let mapIdCounter = 0;

@Component({
    template: require('./template.html')
})
export default class GeoMapComponent extends Vue {

    mapId = `map-${mapIdCounter++}`;
    height: number = 500;

    /**
     * Triggered when component is displayed
     */
    public mounted() {

        this.height = this.getMaximumHeight();

        var map = L.map(this.mapId).setView([51.505, -0.09], 13);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // TODO: restore
        // L.marker([51.5, -0.09]).addTo(map)
        //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        //     .openPopup();
    }

    private getMaximumHeight(): number {
        return (document.querySelector('.geo-map').parentNode as any).clientHeight - 100;
    }
}
