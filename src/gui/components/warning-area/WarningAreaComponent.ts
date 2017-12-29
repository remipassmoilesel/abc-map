import * as _ from 'lodash';
import Component from 'vue-class-component';
import {Clients} from '../../lib/clients/Clients';
import {uxSearchableComponents} from '../components';
import {IUxSearchResult} from '../UiSearchableComponents';
import {UiShortcuts} from '../../lib/UiShortcuts';
import {AbstractUiComponent} from '../AbstractUiComponent';
import {MainStore} from '../../lib/store/store';
import {StoreWrapper} from '../../lib/store/StoreWrapper';
import './style.scss';

@Component({
    template: require('./template.html'),
})
export class WarningAreaComponent extends AbstractUiComponent {

    public componentName: string = 'Warning area';
    public componentDescription: string = 'Allow to display warning on top of window.';
    public componentTagName: string = 'warning-area';

    public shortcuts: UiShortcuts;
    public clients: Clients;
    public $store: MainStore;
    public storeWrapper: StoreWrapper;

    constructor() {
        super();
    }

    public mounted() {

    }

}
