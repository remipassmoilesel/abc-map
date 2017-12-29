import Component from 'vue-class-component';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';
import {Clients} from '../../lib/clients/Clients';
import {MainStore} from '../../lib/store/store';
import {StoreWrapper} from '../../lib/store/StoreWrapper';
import {AbstractUiComponent} from '../AbstractUiComponent';
import {Toaster} from '../../lib/Toaster';
import * as _ from 'lodash';
import './style.scss';
import {GeoJsonLayer} from "../../../api/entities/layers/GeoJsonLayer";

@Component({
    template: require('./template.html'),
})
export class LayerSelectorComponent extends AbstractUiComponent {

    public componentName: string = 'Layer selector';
    public componentDescription: string = 'Allow to select, move or delete map layers';
    public componentTagName: string = 'layer-selector';
    public componentIsSearchable: boolean = true;

    public editDialogIsVisible: boolean = false;

    public clients: Clients;
    public $store: MainStore;
    public storeWrapper: StoreWrapper;

    public selectedLayersIds: string[] = [];

    public getLayers(): AbstractMapLayer[] {
        return this.storeWrapper.project.getProjectLayers(this.$store);
    }

    public deleteSelection() {
        if (this.selectedLayersIds.length > 0) {
            this.clients.project.deleteLayers(this.selectedLayersIds);
        }
    }

    public toggleEditDialog() {
        this.editDialogIsVisible = !this.editDialogIsVisible;
    }

    public async openLayerAsSpreadsheet() {
        this.toggleEditDialog();

        if (this.selectedLayersIds.length !== 1) {
            Toaster.error('You must select exactly one layer before');
            return;
        }

        const project = await this.clients.project.getCurrentProject();
        const lay = _.filter(project.layers, (lay: AbstractMapLayer) => lay.id);
        if (!(lay instanceof GeoJsonLayer)) {
            Toaster.error('Layer must be a GeoJson layer');
            return;
        }

        await this.clients.map.editLayerAsSpreadsheet(this.selectedLayersIds[0]);
        this.selectedLayersIds = [];
    }

}
