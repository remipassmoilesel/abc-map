import * as _ from 'lodash';
import Component from 'vue-class-component';
import {GeocodingResult} from '../../../api/entities/GeocodingResult';
import {AbstractUiComponent} from '../AbstractUiComponent';
import './style.scss';

@Component({
    template: require('./template.html'),
})
export class GeoSearchComponent extends AbstractUiComponent {

    public componentName = 'Geo location search';
    public componentDescription = 'Allow to search for a place, a location or an address, then display it on map';
    public componentTagName: string = 'geo-search';
    public componentIsSearchable: boolean = true;

    public querySearch(query: string, cb: (autocompleteDisplay: any[]) => any) {

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
                    zoom: 8,
                },
            });
    }

}
