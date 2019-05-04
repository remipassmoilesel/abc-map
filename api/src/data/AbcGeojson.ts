// tslint:disable:max-line-length

import * as gj from 'geojson';

// TODO: merge with frontend style properties and remove anys
export interface IAbcFeatureProperties {
    [k: string]: any;

    abcmap: {
        style: any;
    };
}

export interface IAbcGeojsonFeature extends gj.Feature<any, IAbcFeatureProperties> {
    id: string;
}

export interface IAbcGeojsonFeatureCollection extends gj.FeatureCollection<any, IAbcFeatureProperties> {
    id: string;
    features: IAbcGeojsonFeature[];
}
