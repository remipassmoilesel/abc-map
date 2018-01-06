import {Ipc} from '../ipc/Ipc';
import {AbstractServiceConsumer} from '../common/AbstractServiceConsumer';

export abstract class AbstractService extends AbstractServiceConsumer {

    protected ipc: Ipc;

    constructor(ipc: Ipc) {
        super();
        this.ipc = ipc;
    }

    public abstract onAppExit(): Promise<void>;

}
