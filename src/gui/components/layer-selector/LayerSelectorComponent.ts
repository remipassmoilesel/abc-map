import Vue from 'vue';
import Component from 'vue-class-component';
import {AbstractMapLayer} from "../../../api/entities/AbstractMapLayer";
import './style.scss';

@Component({
    template: require('./template.html'),
})
export default class LayerSelectorComponent extends Vue {

    public selectedLayers: string[] = [];

    public getLayers(): AbstractMapLayer[] {
        return this.$store.getters.projectLayers;
    }

    public deleteSelection() {
        console.log(arguments);
        console.log(this.selectedLayers);
    }

}
