

export class CacheType {
    constructor(public readonly extension: string) {

    }
}

export class CacheTypes {
    public static readonly GEOJSON = new CacheType('.cache.geojson');
}

export class CacheHelper {

    public static getCachePath(path: string, cache: CacheType): string {
        return path + cache.extension;
    }

    public static getGeojsonCachePath(path: string): string {
        return path + CacheTypes.GEOJSON.extension;
    }

}
