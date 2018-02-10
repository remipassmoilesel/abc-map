import * as _ from 'lodash';
import Component from 'vue-class-component';
import {AbstractMapLayer} from '../../../api/entities/layers/AbstractMapLayer';
import {AbstractUiComponent} from '../AbstractUiComponent';
import {GeoJsonLayer} from '../../../api/entities/layers/GeoJsonLayer';
import './style.scss';

const addAGeoJsonLayer = 'Add a Geojson layer';

interface ILayerOption {
    name: string;
    layer?: AbstractMapLayer;
}

@Component({
    template: require('./template.html'),
})
export class AddLayerComponent extends AbstractUiComponent {

    public componentName = 'Add a default Tile layer';
    public componentDescription = 'Add a default tile layer in order to display a world map.';
    public componentTagName: string = 'add-layer-selector';
    public componentIsSearchable: boolean = true;

    public layersToAdd: ILayerOption[] = [];
    public layerOptions: ILayerOption[] = [];

    public async beforeMount() {
        const layers = await this.clients.map.getDefaultTileLayers();
        this.layerOptions.push({name: addAGeoJsonLayer});
        this.layerOptions = this.layerOptions.concat(_.map(layers, (lay) => {
            return {name: lay.name, layer: lay};
        }));
        console.log(this.layerOptions);
    }

    public async addLayers() {
        for (const lay of this.layersToAdd) {
            if (lay.layer) {
                await this.clients.project.addLayer(lay.layer);
            } else {
                const layer = new GeoJsonLayer('New Geojson layer');
                await this.clients.project.addLayer(layer);
            }
        }
        this.layersToAdd = [];
    }

}
