import * as _ from 'lodash';
import {AbstractTest} from '../test-man/AbstractTest';
import {LayerSelectorComponent} from '../../components/layer-selector/LayerSelectorComponent';
import {GeoJsonLayer} from '../../../api/entities/layers/GeoJsonLayer';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';
import {TestUtils} from '../TestUtils';
import {DefaultTileLayers} from '../../../api/entities/layers/DefaultTileLayers';

export class LayerSelectorTest extends AbstractTest {
    public name: string = 'LayerSelectorTest';

    public registerTests(): any[] {
        return [
            this.addLayerShouldUpdateComponent,
            this.deleteLayerShouldSucceed,
            this.editLayerAsSpreadsheetShouldRejectBadLayer,
            this.editLayerAsSpreadsheetShouldRejectTooManyLayers,
            this.editLayerAsSpreadsheetShouldAcceptCorrectSelection,
        ];
    }

    public async addLayerShouldUpdateComponent() {
        const selector: LayerSelectorComponent = TestUtils.newVueComponent(LayerSelectorComponent);
        const originalLayer = new GeoJsonLayer('');

        await this.clients.project.addLayer(originalLayer);
        const addedLayer: AbstractMapLayer = _.filter(selector.getLayers(),
            (lay: AbstractMapLayer) => lay.id === originalLayer.id)[0];

        this.assert.deepEqual(addedLayer, originalLayer);
    }

    public async deleteLayerShouldSucceed() {
        const selector: LayerSelectorComponent = TestUtils.newVueComponent(LayerSelectorComponent);
        const originalLayer = new GeoJsonLayer('');

        await this.clients.project.addLayer(originalLayer);
        selector.selectedLayersIds = [originalLayer.id];

        await selector.deleteSelection();

        const foundLayers: AbstractMapLayer[] = _.filter(selector.getLayers(),
            (lay: AbstractMapLayer) => lay.id === originalLayer.id);

        this.assert.lengthOf(foundLayers, 0);
    }

    public async editLayerAsSpreadsheetShouldRejectBadLayer() {
        const selector: LayerSelectorComponent = TestUtils.newVueComponent(LayerSelectorComponent);
        this.sinon.stub(selector, 'toggleEditDialog');

        const originalLayer = new DefaultTileLayers().getLayer(0);

        await this.clients.project.addLayer(originalLayer);

        selector.selectedLayersIds = [originalLayer.id];
        const res = await selector.openLayerAsSpreadsheet();

        this.assert.isFalse(res);
    }

    public async editLayerAsSpreadsheetShouldRejectTooManyLayers() {
        const selector: LayerSelectorComponent = TestUtils.newVueComponent(LayerSelectorComponent);
        this.sinon.stub(selector, 'toggleEditDialog');

        const layers = [new GeoJsonLayer(''), new GeoJsonLayer('')];

        await this.clients.project.addLayer(layers[0]);
        await this.clients.project.addLayer(layers[1]);

        selector.selectedLayersIds = [layers[0].id, layers[1].id];
        const res = await selector.openLayerAsSpreadsheet();

        this.assert.isFalse(res);
    }

    public async editLayerAsSpreadsheetShouldAcceptCorrectSelection() {
        const selector: LayerSelectorComponent = TestUtils.newVueComponent(LayerSelectorComponent);
        this.sinon.stub(selector, 'toggleEditDialog');

        const layer = new GeoJsonLayer('');

        await this.clients.project.addLayer(layer);

        selector.selectedLayersIds = [layer.id];
        const res = await selector.openLayerAsSpreadsheet();

        this.assert.isTrue(res);
    }

}
