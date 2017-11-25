export class MenuItem {
    public id: string;
    public label: string;
    public action: () => void;

    constructor(id: string, label: string, action: () => void) {
        this.id = id;
        this.label = label;
        this.action = action;
    }
}
