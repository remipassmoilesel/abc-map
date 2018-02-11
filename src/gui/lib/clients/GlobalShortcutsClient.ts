import {Ipc, IpcHandler} from '../../../api/ipc/Ipc';
import {IpcEventBus} from '../../../api/ipc/IpcSubject';
import {EventType} from '../../../api/ipc/IpcEventTypes';
import {IpcEvent} from '../../../api/ipc/IpcEvent';

/**
 * Allow to use global shortcuts in GUI, which can be triggered even if app is minimized or not displayed.
 */
export class GlobalShortcutsClient {

    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
    }

    public onEvents(handler: IpcHandler): void {
        return this.ipc.listen(IpcEventBus.SHORTCUTS, handler);
    }

    public onEvent(type: EventType, handler: IpcHandler): void {
        return this.ipc.listen(IpcEventBus.SHORTCUTS, (event: IpcEvent) => {
            if (event.type && event.type.id === type.id) {
                handler(event);
            }
        });
    }

}
