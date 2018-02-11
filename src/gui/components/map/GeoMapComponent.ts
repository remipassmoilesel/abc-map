import Component from 'vue-class-component';
import * as L from 'leaflet';
import * as _ from 'lodash';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';
import {LeafletLayerFactory} from '../../lib/map/LeafletLayerFactory';
import {MapView} from '../../lib/map/MapView';
import {Logger} from '../../../api/dev/Logger';
import {clients} from '../../lib/mixins';
import {AbstractUiComponent} from '../AbstractUiComponent';
import {DrawingModule} from './DrawingModule';
// Import style
import './style.scss';
// Import plugins
import 'leaflet-draw';
import {LayerUpdater} from "./LayerUpdater";

let mapIdCounter = 0;
const logger = Logger.getLogger('GeoMapComponent');

@Component({
    template: require('./template.html'),
})
export class GeoMapComponent extends AbstractUiComponent {

    public componentName: string = 'Map';
    public componentDescription: string = 'Component on which we can see the current map';
    public componentTagName: string = 'geo-map';

    public mapId = `map-${mapIdCounter++}`;
    public height: number = 500;

    private layerUpdater: LayerUpdater;
    private drawingModule: DrawingModule;
    private map: L.Map;

    public beforeMount() {
        // fix height before in order to prevent troubles on map size
        this.height = this.getMaximumHeight();
    }

    public mounted() {
        this.map = L.map(this.mapId).setView([45.18, 5.72], 13);
        this.drawingModule = new DrawingModule(this.map);
        this.layerUpdater = new LayerUpdater(this.map, this);
    }

    public updated() {
        this.layerUpdater.onMapComponentUpdated();
        this.drawingModule.onMapComponentUpdated();
        this.updateView();
    }

    private updateView() {
        const view = this.getCurrentMapView();
        if (view) {
            logger.info('Updating view: ' + view);
            this.map.flyTo([view.latitude, view.longitude], 14, {animate: true});
        }
    }

    public getCurrentMapView(): MapView {
        return this.storeWrapper.map.getMapView(this.$store);
    }

    public getLayers(): AbstractMapLayer[] {
        return this.storeWrapper.project.getProjectLayers(this.$store);
    }

    public getMaximumHeight(): number {
        return window.innerHeight / 100 * 82;
    }

    public onDragOver(event: any) {
        event.stopPropagation();
        event.preventDefault();

        // console.log(event)
    }

    public async onDrop(event: any) {
        event.stopPropagation();
        event.preventDefault();

        await this.clients.map.checkAndImportFiles(event.dataTransfer.files);
    }

}
