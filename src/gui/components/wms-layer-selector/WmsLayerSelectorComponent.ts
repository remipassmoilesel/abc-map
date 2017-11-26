import Vue from 'vue';
import Component from 'vue-class-component';
import {Clients} from '../../lib/clients/Clients';
import {WmsLayer} from '../../../api/entities/WmsLayer';
import './style.scss';

@Component({
    template: require('./template.html'),
})
export default class WmsLayerSelectorComponent extends Vue {

    public clients: Clients;
    public layers: WmsLayer[] = [];

    public beforeMount() {
        this.clients.mapClient.getDefaultWmsLayers().then((layers) => {
            this.layers = layers;
        }).catch((e) => {
            console.log(e);
        });
    }


}
