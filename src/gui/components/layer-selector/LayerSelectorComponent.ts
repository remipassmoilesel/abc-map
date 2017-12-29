import Component from 'vue-class-component';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';
import {Clients} from '../../lib/clients/Clients';
import './style.scss';
import {MainStore} from '../../lib/store/store';
import {StoreWrapper} from '../../lib/store/StoreWrapper';
import {AbstractUiComponent} from '../AbstractUiComponent';
import {Toaster} from "../../lib/Toaster";

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

    public selectedLayers: string[] = [];

    public getLayers(): AbstractMapLayer[] {
        return this.storeWrapper.project.getProjectLayers(this.$store);
    }

    public deleteSelection() {
        if (this.selectedLayers.length > 0) {
            this.clients.project.deleteLayers(this.selectedLayers);
        }
    }

    public toggleEditDialog() {
        this.editDialogIsVisible = !this.editDialogIsVisible;
    }

    public openLayerAsSpreadsheet() {
        this.toggleEditDialog();
        Toaster.warning('Coming soon !');
    }

}
