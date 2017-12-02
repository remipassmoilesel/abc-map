export class GeocodingResult {
    private resolvedName: string;
    private latitude: number;
    private longitude: number;

    constructor(resolvedName: string, latitude: number, longitude: number) {
        this.resolvedName = resolvedName;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
