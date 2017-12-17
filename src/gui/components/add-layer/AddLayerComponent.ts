import Component from 'vue-class-component';
import {Clients} from '../../lib/clients/Clients';
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import {AbstractUiComponent} from "../AbstractUiComponent";
import {TileLayer} from "../../../api/entities/layers/TileLayer";
import './style.scss';

@Component({
    template: require('./template.html'),
})
export class AddLayerComponent extends AbstractUiComponent {

    public componentName = "Add a default Tile layer";
    public componentDescription = "Add a default tile layer in order to display a world map.";
    public componentTagName: string = 'add-layer-selector';
    public componentIsSearchable: boolean = true;

    public layersToAdd: TileLayer[] = [];

    public clients: Clients;
    public layers: AbstractMapLayer[] = [];

    public beforeMount() {
        this.clients.map.getDefaultTileLayers()
            .then((layers) => {
                this.layers = layers;
            })
            .catch((e) => {
                console.log(e);
            });
    }

    public addLayers() {
        for (const lay of this.layersToAdd) {
            this.clients.project.addLayer(lay);
        }
        this.layersToAdd = [];
    }

}
