import {Ipc, IpcHandler} from '../../../api/ipc/Ipc';
import {IpcEventBus} from "../../../api/ipc/IpcSubject";
import {EventType} from "../../../api/ipc/IpcEventTypes";
import {IpcEvent} from "../../../api/ipc/IpcEvent";

export class ShortcutClient {

    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;

        this.onEvent(EventType.SC_QUIT, () => {
            window.close();
        })
    }

    public onEvents(handler: IpcHandler): void {
        return this.ipc.listen(IpcEventBus.SHORTCUTS, handler);
    }

    public onEvent(type: EventType, handler: IpcHandler): void {
        return this.ipc.listen(IpcEventBus.SHORTCUTS, (event: IpcEvent) => {
            if (event.type.id === type.id) {
                handler(event);
            }
        });
    }

}
