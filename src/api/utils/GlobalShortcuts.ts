import {Ipc} from '../ipc/Ipc';
import * as _ from 'lodash';
import {globalShortcut} from 'electron';
import {Logger} from '../dev/Logger';

const logger = Logger.getLogger('Shortcuts');

interface IShortcutDescription {
    keys: string;
    action: Function;
}

/**
 * Here we can define shortcuts that are available everywhere when program is up,
 * Even if program is reduced.
 */
export class Shortcuts {
    private ipc: Ipc;

    constructor(ipc: Ipc) {
        this.ipc = ipc;
        this.initShortcuts();
    }

    private getShortcuts(): IShortcutDescription[] {
        return [];
    }

    private initShortcuts() {
        _.forEach(this.getShortcuts(), (shortcut) => {
            const ret = globalShortcut.register(shortcut.keys, shortcut.action);

            if (!ret) {
                logger.error(`Failed to map shortcut: ${shortcut.keys}`);
            }
        });
    }

}
