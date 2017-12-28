import {Ipc} from '../ipc/Ipc';
import * as _ from 'lodash';
import {globalShortcut} from 'electron';
import {Logger} from '../dev/Logger';
import {AbstractService} from '../services/AbstractService';

const logger = Logger.getLogger('Shortcuts');

interface IShortcutDescription {
    keys: string;
    action: () => void;
}

/**
 * Here we can define shortcuts that are available everywhere when program is up,
 * Even if program is reduced.
 */
export class GlobalShortcutsService extends AbstractService{

    constructor(ipc: Ipc) {
        super(ipc);
        this.initShortcuts();
    }

    public onAppExit(): Promise<void> {
        return Promise.resolve();
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
