import Component from 'vue-class-component';
import './style.scss';
import {AbstractUiComponent} from "../AbstractUiComponent";

@Component({
    template: require('./template.html'),
})
export class LeftMenuComponent extends AbstractUiComponent {

    public componentName: string = 'Left menu';
    public componentDescription: string = 'Menu on left of window with common actions';
    public componentTagName: string = 'left-menu';

    public isCollapse = false;

    /**
     * Triggered when component is displayed
     */
    public mounted() {

    }

    public handleOpen() {

    }

    public handleClose() {

    }
}
