import {AbstractGeocoder} from './AbstractGeocoder';
import {IGeocodingResult} from './IGeocodingResult';
import axios from 'axios';
import * as _ from 'lodash';

export interface INominatimResult {
    place_id: string;
    licence: string;
    osm_type: string;
    osm_id: string;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon: string;
}

export class NominatimGeocoder extends AbstractGeocoder {

    private resultsLimit = 10;
    private baseUrl = 'http://nominatim.openstreetmap.org/search?format=json&limit=:limit&q=:query';

    public async geocode(query: string): Promise<IGeocodingResult[]> {
        const data: INominatimResult[] = await this.requestRaw(query);
        return _.map(data, (res: INominatimResult) => {
            return {
                resolvedName: res.display_name,
                latitude: Number(res.lat),
                longitude: Number(res.lon),
            };
        });
    }

    public requestRaw(query: string): Promise<INominatimResult[]> {
        const requestUrl = this.buildRequestUrl(query);
        return axios
            .get(requestUrl).then((result) => {
                return result.data;
            });
    }

    private buildRequestUrl(query: string): string {
        return this.baseUrl
            .replace(':limit', String(this.resultsLimit))
            .replace(':query', query);
    }
}
