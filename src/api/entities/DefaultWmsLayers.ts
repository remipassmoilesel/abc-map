import { WmsLayer } from './WmsLayer';

export class DefaultWmsLayers {

    private _layers: WmsLayer[];

    constructor() {
        this._layers = [
            new WmsLayer('OpenStreetMap World',
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
            new WmsLayer('OpenStreetMap France',
                'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'),
            new WmsLayer('Heidelberg university',
                'https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}'),
        ];
    }

    get layers(): WmsLayer[] {
        return this._layers;
    }

    set layers(value: WmsLayer[]) {
        this._layers = value;
    }
}
