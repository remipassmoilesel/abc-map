import Component from 'vue-class-component';
import {Clients} from '../../lib/clients/Clients';
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import {UxComponent} from "../UxComponent";
import './style.scss';

@Component({
    template: require('./template.html'),
})
export class AddLayerComponent extends UxComponent {

    public name = "Add a Tile layer";
    public description = "Add a tile layer in order to display a world map";

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
