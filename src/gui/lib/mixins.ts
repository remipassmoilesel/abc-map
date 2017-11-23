import Vue from 'vue';
import {Clients} from "./clients/Clients";

const clients = new Clients();

Vue.mixin({
    data: () => {
        return {
            clients,
        };
    },
});
