import Component from 'vue-class-component';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';
import {AbstractUiComponent} from '../AbstractUiComponent';
import {Toaster} from '../../lib/Toaster';
import {GeoJsonLayer} from '../../../api/entities/layers/GeoJsonLayer';
import * as _ from 'lodash';
import './style.scss';

@Component({
    template: require('./template.html'),
})
export class LayerSelectorComponent extends AbstractUiComponent {

    public componentName: string = 'Layer selector';
    public componentDescription: string = 'Allow to select, move or delete map layers';
    public componentTagName: string = 'layer-selector';
    public componentIsSearchable: boolean = true;

    public editDialogIsVisible: boolean = false;

    public selectedLayersIds: string[] = [];

    public async setActiveLayer() {
        const first: string | undefined = _.first(this.selectedLayersIds);
        if (!first) {
            console.error('No layer found');
            return;
        }
        await this.clients.project.setActiveLayer(first);
    }

    public getActiveLayer(): AbstractMapLayer | null {
        const project = this.storeWrapper.project.getCurrentProject(this.$store);
        if (!project) {
            return null;
        }
        return project.activeLayer;
    }

    public getActiveLayerName(): string {
        const activeLayer = this.getActiveLayer();
        return activeLayer ? activeLayer.name : 'No active layer yet';
    }

    public getLayers(): AbstractMapLayer[] {
        return this.storeWrapper.project.getProjectLayers(this.$store);
    }

    public async deleteSelection() {
        if (this.selectedLayersIds.length > 0) {
            await this.clients.project.deleteLayers(this.selectedLayersIds);
        } else {
            Toaster.info('You must select at least one layer first.');
        }
    }

    public toggleEditDialog() {
        this.editDialogIsVisible = !this.editDialogIsVisible;
    }

    public async openLayerAsSpreadsheet(): Promise<boolean> {
        this.toggleEditDialog();

        if (this.selectedLayersIds.length !== 1) {
            Toaster.error('You must select exactly one layer before');
            return false;
        }

        const layId = this.selectedLayersIds[0];
        const lay = _.filter(this.getLayers(), (lay: AbstractMapLayer) => lay.id === layId)[0];

        if (!(lay instanceof GeoJsonLayer)) {
            Toaster.error('Layer must be a GeoJson layer');
            return false;
        }

        await this.clients.map.editLayerAsSpreadsheet(this.selectedLayersIds[0]);
        this.selectedLayersIds = [];

        return true;
    }

}
