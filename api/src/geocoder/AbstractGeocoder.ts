import {IGeocodingResult} from './IGeocodingResult';

export abstract class AbstractGeocoder {

    public abstract geocode(query: string): Promise<IGeocodingResult[]>;

    public abstract requestRaw(query: string): Promise<any[]>;

}
