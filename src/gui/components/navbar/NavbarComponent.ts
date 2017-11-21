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
    public activeMenuId = '';

    /**
     * Triggered when component is displayed
     */
    public mounted() {
        document.body.addEventListener('click', (e: MouseEvent) => {
            // TODO: close menu if click is outside
        });
    }

    public onMenuOpened(activeMenuId: string) {

        // first click, open menu
        if (activeMenuId !== this.activeMenuId) {
            this.activeMenuId = activeMenuId;
        }
        // second click on element, close all
        else {
            this.activeMenuId = '';
        }

    }

}
