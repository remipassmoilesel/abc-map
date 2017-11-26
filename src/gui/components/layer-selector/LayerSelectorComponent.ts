import Vue from 'vue';
import Component from 'vue-class-component';
import {AbstractMapLayer} from "../../../api/entities/AbstractMapLayer";
import './style.scss';

@Component({
    template: require('./template.html'),
})
export default class LayerSelectorComponent extends Vue {

    public layers: AbstractMapLayer[] = [];

    public getLayers(): AbstractMapLayer[] {
        return this.$store.getters.projectLayers;
    }

}
