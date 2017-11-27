import Vue from 'vue';
import Component from 'vue-class-component';
import {Clients} from '../../lib/clients/Clients';
import {AbstractMapLayer} from "../../../api/entities/AbstractMapLayer";
import './style.scss';

@Component({
    template: require('./template.html'),
})
export default class AddLayerComponent extends Vue {

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
