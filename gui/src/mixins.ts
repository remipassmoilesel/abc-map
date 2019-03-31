import Vue from 'vue';
import {ServiceMap} from "@/lib/ServiceMap";

const services = new ServiceMap();

Vue.mixin({
    data: () => {
        return {
            services,
        };
    },
});
