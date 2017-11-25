import Vue from 'vue';
import * as _ from 'lodash';
import Component from 'vue-class-component';
import {navbarMenusList} from "../../lib/menus/navbarMenusList";
import {NavbarMenu} from "../../lib/menus/NavbarMenu";
import {Toaster} from "../../lib/Toaster";
import {MenuItem} from "../../lib/menus/MenuItem";
import './style.scss';

@Component({
    template: require('./template.html'),
})
export default class NavbarComponent extends Vue {

    public menus: NavbarMenu[] = navbarMenusList;

    /**
     * Triggered when component is displayed
     */
    public mounted() {

    }

    public handleMenuClick(id) {

        console.log(arguments);
        console.log(id);

        const menuItem = this.getMenuItemById(id);

        try {
            menuItem.action();
        } catch (e) {
            console.log(e);
            Toaster.error(e.message);
        }
    }

    public getMenuItemById(id: string): MenuItem {

        let rslt: MenuItem[] = [];
        _.forEach(this.menus, (m: NavbarMenu) => {
            rslt = rslt.concat(_.filter(m.items, (mi: MenuItem) => mi.id === id));
        });

        if (rslt.length > 1) {
            throw new Error(`Duplicate id for menu: ${id} / ${rslt}`);
        }

        if (rslt.length === 0) {
            throw new Error(`Invalid id: ${id}`);
        }

        return rslt[0];
    }

}
