import Vue from 'vue';
import {clients} from "@/lib/IClientsMap";
import {StoreWrapper} from "@/lib/store/StoreWrapper";

Vue.mixin({
    data: () => {
        return {
            storew: new StoreWrapper(),
            clients,
        };
    },
});
