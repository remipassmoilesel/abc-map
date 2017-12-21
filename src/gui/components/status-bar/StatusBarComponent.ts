import Component from 'vue-class-component';
import './style.scss';
import {MainStore} from '../../lib/store/store';
import {StoreWrapper} from '../../lib/store/StoreWrapper';
import {AbstractUiComponent} from '../AbstractUiComponent';

@Component({
    template: require('./template.html'),
})
export class StatusBarComponent extends AbstractUiComponent {

    public componentName: string = 'Status bar';
    public componentDescription: string = 'Bar at the bottom of window which display informations';
    public componentTagName: string = 'status-bar';

    public $store: MainStore;
    public storeWrapper: StoreWrapper;

    public getProjectName() {
        return this.storeWrapper.project.getProjectName(this.$store);
    }
}
