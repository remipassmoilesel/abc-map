
export enum MapLayerType {
    RasterOsm = 'RasterOsm',
}

export interface IMapLayer {
    id: string;
    name: string;
    type: MapLayerType;
}
