import { MenuItem } from './MenuItem';
import { NavbarMenu } from './NavbarMenu';

// FIRST MENU
// =======================

const menu1 = new NavbarMenu('Menu 1');
menu1.items.push(new MenuItem('Menu 1 item 1', () => {
    console.log('Menu 1 item 1');
}));
menu1.items.push(new MenuItem('Menu 1 item 2', () => {
    console.log('Menu 1 item 2');
}));
menu1.items.push(new MenuItem('Menu 1 item 3', () => {
    console.log('Menu 1 item 3');
}));


// SECOND MENU
// =======================

const menu2 = new NavbarMenu('Menu 2');
menu2.items.push(new MenuItem('Menu 2 item 1', () => {
    console.log('Menu 2 item 1');
}));
menu2.items.push(new MenuItem('Menu 2 item 2', () => {
    console.log('Menu 2 item 2');
}));
menu2.items.push(new MenuItem('Menu 2 item 3', () => {
    console.log('Menu 2 item 3');
}));

export const menus: NavbarMenu[] = [menu1, menu2];

