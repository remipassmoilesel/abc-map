import Vue from 'vue';
import Component from 'vue-class-component';
import './style.scss';
import {MainStore} from "../../lib/store/store";

@Component({
    template: require('./template.html'),
})
export default class StatusBarComponent extends Vue {

    public $store: MainStore;

    /**
     * Triggered when component is displayed
     */
    public mounted() {

    }

    public getProjectName() {
        return this.$store.getters.projectName;
    }
}
