import Vue from 'vue';
import Component from 'vue-class-component';
import { NavbarMenu } from '../../lib/menu/NavbarMenu';
import './style.scss';

@Component({
    props: ['isActive', 'menu', 'onMenuOpened', 'id'],
    template: require('./template.html'),
})
export default class NavbarMenuComponent extends Vue {

    public menu: NavbarMenu;
    public isActive: boolean;
    public onMenuOpened: () => {};

    /**
     * Triggered when component is displayed
     */
    public mounted() {

    }


}
