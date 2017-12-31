import Vue from 'vue';
import {MainStore} from '../lib/store/store';
import {ClientGroup} from '../lib/clients/ClientGroup';
import {StoreWrapper} from '../lib/store/StoreWrapper';
import {UiShortcuts} from '../lib/UiShortcuts';

export abstract class AbstractUiComponent extends Vue {

    public abstract componentName: string;
    public abstract componentDescription: string;
    public abstract componentTagName: string;

    public componentIsSearchable = false;

    public clients: ClientGroup;
    public $store: MainStore;
    public storeWrapper: StoreWrapper;
    public shortcuts: UiShortcuts;

    constructor(data?: any) {
        super(data);
    }
}
