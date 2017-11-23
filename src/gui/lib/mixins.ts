import Vue from 'vue';
import {Clients} from "./clients/Clients";

export const clients = new Clients();

Vue.mixin({
    data: () => {
        return {
            clients,
        };
    },
});
