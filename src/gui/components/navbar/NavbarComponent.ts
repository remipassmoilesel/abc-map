import Vue from 'vue';
import Component from 'vue-class-component';
import './style.scss';
import {Clients} from '../../lib/clients/Clients';

@Component({
    template: require('./template.html'),
})
export default class NavbarComponent extends Vue {

    public activeIndex = '1';

    /**
     * Triggered when component is displayed
     */
    public mounted() {

    }

    public handleSelect() {

    }
}
