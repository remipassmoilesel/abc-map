import {GeocodingResult} from "../entities/GeocodingResult";

export abstract class AbstractGeocoder {

    public abstract geocode(query: string): Promise<GeocodingResult[]>;

    public abstract requestRaw(query: string): Promise<any[]>;

}