import {FeatureCollection} from 'geojson';

export enum MapLayerType {
    Wms = 'Raster',
    Vector = 'Vector',
    Predefined = 'Predefined',
}

export interface IMapLayer {
    id: string;
    name: string;
    type: MapLayerType;
}

export interface IVectorLayer extends IMapLayer {
    type: MapLayerType.Vector;
    featureCollection: FeatureCollection
}

export type WmsParams = { [k: string]: string };

export interface IWmsLayer extends IMapLayer {
    type: MapLayerType.Wms;
    url: string;
    wmsParams: WmsParams;
}

export enum PredefinedLayerPreset {
    OSM = 'OSM',
}

export interface IPredefinedLayer extends IMapLayer {
    type: MapLayerType.Predefined;
    preset: PredefinedLayerPreset;
}
