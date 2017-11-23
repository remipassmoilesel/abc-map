
import { AbstractMapLayer } from './AbstractMapLayer';

export class WmsLayer extends AbstractMapLayer {

    private _url: string;

    constructor(name: string, url: string) {
        super(name);
        this._url = url;
    }

    get url(): string {
        return this._url;
    }
}
