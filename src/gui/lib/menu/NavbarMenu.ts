import { MenuItem } from './MenuItem';

export class NavbarMenu {
    public items: MenuItem[];
    public title: string;

    constructor(title: string, items?: MenuItem[]) {
        this.title = title;
        this.items = items || [];
    }
}
