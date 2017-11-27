import {TileLayer} from './layers/TileLayer';
import * as _ from 'lodash';

export class DefaultTileLayers {

    private _layers: TileLayer[];

    constructor() {
        this._layers = [
            new TileLayer('OpenStreetMap World',
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
            new TileLayer('OpenStreetMap France',
                'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'),
            new TileLayer('Heidelberg university',
                'https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}'),
        ];

        // template layers should not have id
        _.forEach(this._layers, (lay) => {
            lay.id = '';
        })
    }

    get layers(): TileLayer[] {
        return this._layers;
    }

    set layers(value: TileLayer[]) {
        this._layers = value;
    }
}
