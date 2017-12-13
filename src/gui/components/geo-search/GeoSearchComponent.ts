import Vue from 'vue';
import * as _ from 'lodash';
import Component from 'vue-class-component';
import {Clients} from "../../lib/clients/Clients";
import {GeocodingResult} from "../../../api/entities/GeocodingResult";
import {MainStore} from "../../lib/store/store";
import {StoreWrapper} from "../../lib/store/StoreWrapper";
import {IUxComponent} from "../IUxComponent";
import './style.scss';

@Component({
    template: require('./template.html'),
})
export class GeoSearchComponent extends Vue implements IUxComponent {

    public name = "Geo location search";
    public description = "You can search for a place, a location or an address.";

    public clients: Clients;
    public $store: MainStore;
    public storeWrapper: StoreWrapper;

    /**
     * Triggered when component is displayed
     */
    public mounted() {

    }

    public querySearch(query: string, cb: Function) {

        if (query.length < 3) {
            cb([{value: 'Please type at least 3 characters'}]);
            return;
        }

        return this.clients.map.geocode(query).then((results: GeocodingResult[]) => {
            const autocompleteDisplay: any[] = _.map(results, (r: GeocodingResult) => {
                return {value: r.resolvedName, completeResult: r};
            });
            cb(autocompleteDisplay);
        });

    }

    public handleSelect(selectedObject) {
        const res = selectedObject.completeResult;
        this.storeWrapper.map.updateMapView(this.$store,
            {
                view: {
                    latitude: res.latitude,
                    longitude: res.longitude,
                    zoom: 8
                }
            });
    }

}
