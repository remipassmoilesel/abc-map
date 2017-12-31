import Vue from 'vue';
import {ClientGroup} from './clients/ClientGroup';
import {StoreWrapper} from './store/StoreWrapper';
import {UiShortcuts} from './UiShortcuts';

export const clients = new ClientGroup();
const storeWrapper = new StoreWrapper();
const shortcuts = new UiShortcuts();

Vue.mixin({
    data: () => {
        return {
            clients,
            shortcuts,
            storeWrapper,
        };
    },
});
