import {AbstractGeocoder} from './AbstractGeocoder';
import {GeocodingResult} from '../entities/GeocodingResult';
import * as request from 'request-promise';
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

    public async geocode(query: string): Promise<GeocodingResult[]> {
        const data: INominatimResult[] = await this.requestRaw(query);
        const res: GeocodingResult[] = _.map(data, (res: INominatimResult) => {
            return new GeocodingResult(
                res.display_name,
                Number(res.lat),
                Number(res.lon),
            );
        });
        return res;
    }

    public requestRaw(query: string): Promise<INominatimResult[]> {
        const requestUrl = this.getRequestUrl(query);

        // FIXME: remove dev user agent

        /* tslint:disable:max-line-length */
        return request({
            uri: requestUrl, json: true, headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
            },
        }) as any;
        /* tslint:enable:max-line-length */
    }

    private getRequestUrl(query: string): string {
        return this.baseUrl
            .replace(':limit', String(this.resultsLimit))
            .replace(':query', query);
    }
}
