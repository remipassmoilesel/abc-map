import {NavbarMenu} from "./NavbarMenu";
import {MenuItem} from "./MenuItem";
import {Clients} from "../clients/Clients";

const clients = new Clients();

export const projectMenu = new NavbarMenu('Project');

projectMenu.items.push(new MenuItem('project-new', 'New project', () => {
    clients.projectClient.createNewProject();
}));
projectMenu.items.push(new MenuItem('project-save', 'Save project', () => {
    console.log('save-project');
    throw new Error("Not implemented");
}));
projectMenu.items.push(new MenuItem('project-save-as', 'Save project as ...', () => {
    console.log('save-project-as');
    throw new Error("Not implemented");
}));
