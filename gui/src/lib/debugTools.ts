import {StoreWrapper} from "@/lib/store/StoreWrapper";
import {clients} from "@/lib/IClientsMap";
import {LocalStorageHelper, LSKey} from "@/lib/LocalStorageHelper";

export function setDebugToolsInWindow(){

    (window as any).abc = {
        storew: new StoreWrapper(),
        clients,
        localst: new LocalStorageHelper(),
        LSKey: LSKey
    };

}
