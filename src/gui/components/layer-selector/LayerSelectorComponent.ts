import Vue from 'vue';
import Component from 'vue-class-component';
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import {Clients} from "../../lib/clients/Clients";
import './style.scss';

@Component({
    template: require('./template.html'),
})
export default class LayerSelectorComponent extends Vue {

    public clients: Clients;
    public selectedLayers: string[] = [];

    public getLayers(): AbstractMapLayer[] {
        return this.$store.getters.projectLayers;
    }

    public deleteSelection() {
        if (this.selectedLayers.length > 0) {
            this.clients.project.deleteLayers(this.selectedLayers);
        }
    }

}
