import Vue from 'vue';
import {services} from "@/lib/ServiceMap";
import {StoreWrapper} from "@/lib/store/StoreWrapper";

Vue.mixin({
    data: () => {
        return {
            storew: new StoreWrapper(),
            services,
        };
    },
});
