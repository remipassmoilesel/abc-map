// tslint:disable:max-line-length

import * as gj from 'geojson';

export interface IAbcStyleContainer {
    foreground: string;
    background: string;
    strokeWidth: number;
}

export const DEFAULT_STYLE = {
    foreground: 'black',
    background: '',
    strokeWidth: 3,
}

export interface IAbcFeatureProperties {
    [k: string]: any;

    abcmap: {
        style: IAbcStyleContainer;
    };
}

export interface IAbcGeojsonFeature extends gj.Feature<any, IAbcFeatureProperties> {
    id: string;
}

export interface IAbcGeojsonFeatureCollection extends gj.FeatureCollection<any, IAbcFeatureProperties> {
    id: string;
    features: IAbcGeojsonFeature[];
}
