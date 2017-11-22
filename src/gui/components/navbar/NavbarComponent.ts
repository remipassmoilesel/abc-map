import Vue from 'vue';
import Component from "vue-class-component";
import './style.scss'
import {Clients} from "../../lib/clients/Clients";

@Component({
    template: require('./template.html')
})
export default class NavbarComponent extends Vue {

    clients: Clients;
    activeIndex = '1';

    /**
     * Triggered when component is displayed
     */
    public mounted() {
        this.clients.getMapClient().getWmsUrls().then((data) => {
            console.log(data);
        });
    }

    public handleSelect() {

    }
}
