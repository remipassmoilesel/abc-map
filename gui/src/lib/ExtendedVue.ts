import Vue from "vue";
import {IClientsMap} from "@/lib/IClientsMap";
import {Store} from "vuex";
import {IRootState} from "@/lib/store/store";
import {StoreWrapper} from "@/lib/store/StoreWrapper";
import {LocalStorageHelper} from "@/lib/LocalStorageHelper";

export class ExtendedVue extends Vue {

    clients!: IClientsMap;
    $store!: Store<IRootState>;
    storew!: StoreWrapper;
    localst!: LocalStorageHelper;

}
