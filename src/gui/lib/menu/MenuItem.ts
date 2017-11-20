export class MenuItem {
    public title: string;
    public action: () => void;

    constructor(title: string, action: () => void) {
        this.title = title;
        this.action = action;
    }
}
