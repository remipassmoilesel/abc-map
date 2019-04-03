import Vue from 'vue';
import {abcApiClients} from '@/lib/IAbcApiClientMap';
import {abcStorew} from '@/lib/store/AbcStoreWrapper';
import {abcLocalst} from '@/lib/utils/AbcLocalStorageHelper';
import {abcServices} from '@/lib/IAbcServiceMap';

Vue.mixin({
    data: () => {
        return {
            abcStorew,
            abcServices,
            abcApiClients,
            abcLocalst,
        };
    },
});
