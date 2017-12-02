import {AbstractGeocoder} from "./AbstractGeocoder";
import {GeocodingResult} from "../entities/GeocodingResult";
import * as request from 'request-promise';
import * as _ from 'lodash';
import * as Promise from 'bluebird';

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
    private baseUrl = "http://nominatim.openstreetmap.org/search?format=json&limit=:limit&q=:query";

    public geocode(query: string): Promise<GeocodingResult[]> {
        return this.requestRaw(query).then((data: INominatimResult[]) => {
            const res: GeocodingResult[] = _.map(data, (res: INominatimResult) => {
                return new GeocodingResult(
                    res.display_name,
                    Number(res.lat),
                    Number(res.lon),
                );
            });
            return res;
        });
    }

    public requestRaw(query: string): Promise<INominatimResult[]> {
        const requestUrl = this.getRequestUrl(query);
        return request({uri: requestUrl, json: true});
    }

    private getRequestUrl(query: string): string {
        return this.baseUrl
            .replace(':limit', String(this.resultsLimit))
            .replace(':query', query);
    }
}