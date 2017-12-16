import * as Mousetrap from 'mousetrap';


export interface ExtendedKeyboardEvent extends KeyboardEvent {
    returnValue: boolean; // IE returnValue
}

declare type ShortcutHandler = (e: ExtendedKeyboardEvent, combo: string) => any;

export class UiShortcuts {

    constructor() {
        this.initShortcuts();
    }

    private initShortcuts() {


        this.bindShortcut('ctrl+q', this.closeAllWindows.bind(this));
        this.bindShortcut('ctrl+r', this.refreshApplication.bind(this));

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
