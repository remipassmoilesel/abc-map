import {abcStorew} from "../store/AbcStoreWrapper";
import {abcApiClients} from "../IAbcApiClientMap";
import {AbcLocalStorageHelper, LSKey} from "@/lib/utils/AbcLocalStorageHelper";

export function setDebugToolsInWindow() {

    (window as any).abc = {
        abcStorew,
        abcApiClients,
        abcLocalst: new AbcLocalStorageHelper(),
        LSKey: LSKey
    };

}
