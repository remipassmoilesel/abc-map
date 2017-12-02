import Vue from 'vue';
import * as _ from 'lodash';
import Component from 'vue-class-component';
import {Clients} from "../../lib/clients/Clients";
import {GeocodingResult} from "../../../api/entities/GeocodingResult";
import {MainStore} from "../../lib/store/store";
import './style.scss';
import {Actions} from "../../lib/store/mutationsAndActions";
import {MapView} from "../map/MapView";

@Component({
    template: require('./template.html'),
})
export default class GeoSearchComponent extends Vue {

    public clients: Clients;
    public location: string = "";
    public $store: MainStore;

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
        this.$store.dispatch(Actions.MAP_VIEW_UPDATE, {
            view: ({
                latitude: res.latitude,
                longitude: res.longitude,
                zoom: 8
            } as MapView)
        });
    }


}
