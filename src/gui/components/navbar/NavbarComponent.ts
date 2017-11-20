import Vue from 'vue';
import Component from 'vue-class-component';
import { NavbarMenu } from '../../lib/menu/NavbarMenu';
import { menus } from '../../lib/menu/NavbarMenuList';
import './style.scss';

@Component({
    template: require('./template.html'),
})
export default class NavbarComponent extends Vue {

    public menus: NavbarMenu[] = menus;
    public menuIdActive = '';

    /**
     * Triggered when component is displayed
     */
    public mounted() {

    }

    public onMenuOpened(index: number) {
        // TODO close other menus
    }
}
