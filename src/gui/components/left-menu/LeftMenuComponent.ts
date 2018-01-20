import Component from 'vue-class-component';
import {AbstractUiComponent} from '../AbstractUiComponent';
import './style.scss';

@Component({
    template: require('./template.html'),
})
export class LeftMenuComponent extends AbstractUiComponent {

    public componentName: string = 'Left menu';
    public componentDescription: string = 'Menu on left of window with common actions';
    public componentTagName: string = 'left-menu';

    public isCollapse = false;

    public handleOpen() {

    }

    public handleClose() {

    }
}
