import * as $ from 'jquery';
import Component from 'vue-class-component';
import {Clients} from '../../lib/clients/Clients';
import {UiShortcuts} from '../../lib/UiShortcuts';
import {AbstractUiComponent} from '../AbstractUiComponent';
import {MainStore} from '../../lib/store/store';
import {StoreWrapper} from '../../lib/store/StoreWrapper';
import {Logger, LogLevel} from '../../../api/dev/Logger';
import './style.scss';

const logger = Logger.getLogger('WarningAreaComponent');
logger.setLevel(LogLevel.ERROR);

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

    public warningMessage: string = '';
    private connectionTestInterval: number;

    constructor() {
        super();
    }

    public mounted() {
        this.testConnectivity();
        this.connectionTestInterval = (setInterval(this.testConnectivity.bind(this), 4000) as any);
    }

    public testConnectivity() {
        logger.debug('Testing connectivity');
        $.get('http://abc-map.fr')
            .catch((error) => {
                this.warningMessage = 'You are not connected to Internet, many features will be unavailable.';
                logger.debug('Error while connecting to internet: ', error);
            });
    }

    public beforeDestroy() {
        clearInterval(this.connectionTestInterval);
    }

}
