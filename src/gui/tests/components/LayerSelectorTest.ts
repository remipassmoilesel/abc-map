import * as _ from 'lodash';
import {AbstractTest} from '../test-man/AbstractTest';
import {LayerSelectorComponent} from '../../components/layer-selector/LayerSelectorComponent';
import {GeoJsonLayer} from '../../../api/entities/layers/GeoJsonLayer';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';
import {TestUtils} from '../TestUtils';

export class LayerSelectorTest extends AbstractTest {
    public name: string = 'LayerSelectorTest';
    public only = true;

    public registerTests(): any[] {
        return [
            this.addLayerShouldUpdateComponent,
        ];
    }

    public async addLayerShouldUpdateComponent() {

        const selector: LayerSelectorComponent = TestUtils.newVueComponent(LayerSelectorComponent);
        const originalLayer = new GeoJsonLayer();

        console.log(selector);
        this.assert.isDefined(selector.clients);
        this.assert.isDefined(selector.$store);

        await this.clients.project.addLayer(originalLayer);
        const addedLayer: AbstractMapLayer = _.filter(selector.getLayers(),
            (lay: AbstractMapLayer) => lay.id === originalLayer.id)[0];

        this.assert.deepEqual(addedLayer, originalLayer);
    }

}
