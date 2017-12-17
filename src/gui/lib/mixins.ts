import Vue from 'vue';
import {Clients} from "./clients/Clients";
import {StoreWrapper} from "./store/StoreWrapper";
import {UiShortcuts} from "./UiShortcuts";

export const clients = new Clients();
const storeWrapper = new StoreWrapper();
const shortcuts = new UiShortcuts();

Vue.mixin({
    data: () => {
        return {
            clients,
            storeWrapper,
            shortcuts,
        };
    },
});
