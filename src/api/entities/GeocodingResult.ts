export class GeocodingResult {
    public resolvedName: string;
    public latitude: number;
    public longitude: number;

    constructor(resolvedName: string, latitude: number, longitude: number) {
        this.resolvedName = resolvedName;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
