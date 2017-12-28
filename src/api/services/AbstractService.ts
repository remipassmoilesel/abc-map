import {Ipc} from '../ipc/Ipc';

export abstract class AbstractService {
    protected ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public abstract onAppExit(): Promise<void>;
}
