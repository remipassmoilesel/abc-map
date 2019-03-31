import Vue from 'vue';
import {clients} from "@/lib/IClientsMap";
import {StoreWrapper} from "@/lib/store/StoreWrapper";
import {LocalStorageHelper} from "@/lib/LocalStorageHelper";

Vue.mixin({
    data: () => {
        return {
            storew: new StoreWrapper(),
            clients,
            localst: new LocalStorageHelper()
        };
    },
});
