import Vue from 'vue';
import Component from 'vue-class-component';
import './style.scss';
import {MainStore} from "../../lib/store/store";
import {StoreWrapper} from "../../lib/store/StoreWrapper";

@Component({
    template: require('./template.html'),
})
export default class StatusBarComponent extends Vue {

    public $store: MainStore;
    public storeWrapper: StoreWrapper;

    public getProjectName() {
        return this.storeWrapper.project.getProjectName(this.$store);
    }
}
