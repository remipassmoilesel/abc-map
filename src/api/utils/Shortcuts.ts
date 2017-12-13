import {Ipc} from "../ipc/Ipc";
import * as _ from "lodash";
import {globalShortcut} from "electron";
import {Logger} from "../dev/Logger";
import {IpcEventBus} from "../ipc/IpcSubject";
import {EventType} from "../ipc/IpcEventTypes";
import {ElectronUtilities} from "../dev/ElectronDevUtilities";

const logger = Logger.getLogger('Shortcuts');

interface IShortcutDescription {
    keys: string;
    action: Function;
}

export class Shortcuts {
    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
        this.initShortcuts();
    }

    private getShortcuts(): IShortcutDescription[] {
        return [
            {keys: 'CommandOrControl+A', action: this.openActionDialog.bind(this)},
            {keys: 'CommandOrControl+Q', action: this.quit.bind(this)},
            {keys: 'CommandOrControl+R', action: this.refresh.bind(this)}
        ];
    }

    private refresh() {
        if(ElectronUtilities.isDevMode()){
            return this.ipc.send(IpcEventBus.SHORTCUTS, {type: EventType.SC_REFRESH});
        }
    }

    private quit() {
        return this.ipc.send(IpcEventBus.SHORTCUTS, {type: EventType.SC_QUIT});
    }

    private openActionDialog() {
        return this.ipc.send(IpcEventBus.SHORTCUTS, {type: EventType.SC_ACTION_MODAL});
    }

    private initShortcuts() {
        _.forEach(this.getShortcuts(), (shortcut) => {
            const ret = globalShortcut.register(shortcut.keys, shortcut.action);

            if (!ret) {
                logger.error(`Failed to map shortcut: ${shortcut.keys}`)
            }
        });
    }

}