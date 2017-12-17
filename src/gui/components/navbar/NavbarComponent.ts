import * as _ from 'lodash';
import Component from 'vue-class-component';
import {navbarMenusList} from "../../lib/menus/navbarMenusList";
import {NavbarMenu} from "../../lib/menus/NavbarMenu";
import {Toaster} from "../../lib/Toaster";
import {MenuItem} from "../../lib/menus/MenuItem";
import {AbstractUiComponent} from "../AbstractUiComponent";
import './style.scss';
import {MainStore} from "../../lib/store/store";
import {StoreWrapper} from "../../lib/store/StoreWrapper";

@Component({
    template: require('./template.html'),
})
export class NavbarComponent extends AbstractUiComponent {

    public componentName: string = 'Navigation bar';
    public componentDescription: string = 'Top navigation bar';
    public componentTagName: string = 'navbar';

    public $store: MainStore;
    public storeWrapper: StoreWrapper;

    public menus: NavbarMenu[] = navbarMenusList;

    public handleMenuClick(id) {

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

    public showActionDialog() {
        this.storeWrapper.gui.setActionDialogVisible(this.$store, true);
    }

}
