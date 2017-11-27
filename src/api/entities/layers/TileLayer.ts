import {AbstractMapLayer} from './AbstractMapLayer';

// TODO: restore credits
export class TileLayer extends AbstractMapLayer {

    private _url: string;

    constructor(name: string, url: string) {
        super(name);
        this._url = url;
    }

    get url(): string {
        return this._url;
    }

}
