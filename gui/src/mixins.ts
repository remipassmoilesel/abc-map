import Vue from 'vue';
import {services} from "@/lib/ServiceMap";

Vue.mixin({
    data: () => {
        return {
            services,
        };
    },
});
