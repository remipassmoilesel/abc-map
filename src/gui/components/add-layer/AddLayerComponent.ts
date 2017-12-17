import Component from 'vue-class-component';
import {Clients} from '../../lib/clients/Clients';
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import {AbstractUiComponent} from "../AbstractUiComponent";
import './style.scss';

@Component({
    template: require('./template.html'),
})
export class AddLayerComponent extends AbstractUiComponent {

    public componentName = "Add a Tile layer";
    public componentDescription = "Add a tile layer in order to display a world map";
    public componentTagName: string = 'add-layer-selector';
    public componentIsSearchable: boolean = true;

    public clients: Clients;
    public layers: AbstractMapLayer[] = [];

    public beforeMount() {
        this.clients.map.getDefaultWmsLayers()
            .then((layers) => {
                this.layers = layers;
            })
            .catch((e) => {
                console.log(e);
            });
    }

    public handleSelection(index: number) {
        this.clients.project.addLayer(this.layers[index]);
    }

}
