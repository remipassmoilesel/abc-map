import {AbstractTest} from '../test-man/AbstractTest';
import {MapClient} from '../../lib/clients/MapClient';
import {Ipc} from '../../../api/ipc/Ipc';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';

export class MapClientTest extends AbstractTest {
    public name: string = 'MapCLientTest';

    public mapClient: MapClient;

    public registerTests(): any[] {
        return [
            this.getDefaultTileLayerShouldWork,
        ];
    }

    public before() {
        this.mapClient = new MapClient(new Ipc());
    }

    public getDefaultTileLayerShouldWork() {
        return this.mapClient.getDefaultTileLayers()
            .then((layers: AbstractMapLayer[]) => {
                this.assert.isTrue(layers.length > 2);
            });
    }

}
