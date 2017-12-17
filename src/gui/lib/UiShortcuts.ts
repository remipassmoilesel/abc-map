import * as Mousetrap from 'mousetrap';


export interface ExtendedKeyboardEvent extends KeyboardEvent {
    returnValue: boolean; // IE returnValue
}

declare type ShortcutHandler = (e: ExtendedKeyboardEvent, combo: string) => any;

export class UiShortcuts {

    public static readonly QUIT = 'ctrl+q';
    public static readonly REFRESH = 'ctrl+r';
    public static readonly ACTION_MENU = 'ctrl+a';

    constructor() {
        this.initShortcuts();
    }

    private initShortcuts() {
        this.bindShortcut(UiShortcuts.QUIT, this.closeAllWindows.bind(this));
        this.bindShortcut(UiShortcuts.REFRESH, this.refreshApplication.bind(this));
    }

    public bindShortcut(command: string, handler: ShortcutHandler) {
        Mousetrap.bind(command, (e, combo) => {

            // prevent default shortcut behavior
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }

            handler(e, combo);
        });
    }

    private closeAllWindows() {
        window.close();
    }

    private refreshApplication() {
        location.reload();
    }
}
