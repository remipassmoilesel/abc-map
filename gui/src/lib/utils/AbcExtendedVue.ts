import Vue from "vue";
import {IAbcApiClientMap} from "../IAbcApiClientMap";
import {Store} from "vuex";
import {IRootState} from "../store/store";
import {AbcStoreWrapper} from "../store/AbcStoreWrapper";
import {IAbcServiceMap} from "../IAbcServiceMap";
import {AbcLocalStorageHelper} from "@/lib/utils/AbcLocalStorageHelper";

export class AbcExtendedVue extends Vue {

    $store!: Store<IRootState>;
    abcStorew!: AbcStoreWrapper;
    abcLocalst!: AbcLocalStorageHelper;
    abcApiClients!: IAbcApiClientMap;
    abcServices!: IAbcServiceMap;

}
