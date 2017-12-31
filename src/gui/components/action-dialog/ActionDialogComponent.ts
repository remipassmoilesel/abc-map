import * as _ from 'lodash';
import Component from 'vue-class-component';
import {ClientGroup} from '../../lib/clients/ClientGroup';
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
export class ActionDialogComponent extends AbstractUiComponent {

    public componentName: string = 'Action dialog';
    public componentDescription: string = 'Allow to search in component and actions.';
    public componentTagName: string = 'action-dialog';

    public query: string = '';
    public searchMessage: string = '';
    public results: IUxSearchResult[] = [];
    public debouncedSearch: () => any;

    constructor() {
        super();
        this.debouncedSearch = _.debounce(this.searchAndMount.bind(this), 800);
    }

    public mounted() {

        this.shortcuts.bindShortcut(UiShortcuts.ACTION_MENU, () => {

            if (this.storeWrapper.gui.isActionDialogVisible(this.$store) === true) {
                this.dialogIsVisible = false;
            } else {
                this.openActionDialog();
            }
        });

    }

    public onChange() {
        this.debouncedSearch();
    }

    public searchAndMount() {
        this.results = uxSearchableComponents.search(this.query);

        if (this.results.length < 1) {
            this.searchMessage = 'No results found';
        } else {
            this.searchMessage = '';
        }

    }

    get dialogIsVisible() {
        return this.storeWrapper.gui.isActionDialogVisible(this.$store);
    }

    set dialogIsVisible(value: boolean) {
        this.storeWrapper.gui.setActionDialogVisible(this.$store, value);
    }

    private openActionDialog() {
        this.storeWrapper.gui.setActionDialogVisible(this.$store, true);

        // TODO: improve me
        setTimeout(() => {
            (this.$refs.queryTextField as any).focus();
        }, 600);
    }
}
