import Vue from "vue";
import {ServiceMap} from "@/lib/ServiceMap";
import {Store} from "vuex";
import {IRootState} from "@/lib/store/store";
import {StoreWrapper} from "@/lib/store/StoreWrapper";

export class ExtendedVue extends Vue {

    services!: ServiceMap;
    $store!: Store<IRootState>;
    storew!: StoreWrapper;

}
