import Vue from 'vue';
import Component from 'vue-class-component';
import { Clients } from '../../lib/clients/Clients';
import { WmsLayer } from '../../../api/entities/WmsLayer';
import './style.scss';
import { EntitiesUtils } from '../../../api/utils/EntitiesUtils';

@Component({
    template: require('./template.html'),
})
export default class WmsLayerSelectorComponent extends Vue {

    public clients: Clients;
    public layers: WmsLayer[] = [];

    public beforeMount() {
        this.clients.getMapClient().getWmsUrls().then((layers) => {
            this.layers = EntitiesUtils.parseFromRawArray(WmsLayer.prototype, layers);
        });
    }


}
