import Vue from 'vue';
import {Clients} from "./clients/Clients";
import {StoreWrapper} from "./store/StoreWrapper";

export const clients = new Clients();
export const storeWrapper = new StoreWrapper();

Vue.mixin({
    data: () => {
        return {
            clients,
            storeWrapper,
        };
    },
});
