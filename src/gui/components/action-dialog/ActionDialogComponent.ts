import * as _ from 'lodash';
import Component from 'vue-class-component';
import {Clients} from '../../lib/clients/Clients';
import {uxSearchableComponents} from "../components";
import {IUxSearchResult} from "../UiSearchableComponents";
import {UiShortcuts} from "../../lib/UiShortcuts";
import './style.scss';
import {AbstractUiComponent} from "../AbstractUiComponent";

let instanceNumber = 0;

@Component({
    template: require('./template.html'),
})
export class ActionDialogComponent extends AbstractUiComponent {

    public componentName: string = "Action dialog";
    public componentDescription: string = "Allow to search in component and actions.";
    public componentTagName: string = "action-dialog";

    public shortcuts: UiShortcuts;
    public clients: Clients;

    public instanceId = instanceNumber++;
    public query: string = "";
    public searchMessage: string = "";
    public dialogVisible: boolean = false;
    public results: IUxSearchResult[] = [];
    public debouncedSearch: Function;

    constructor() {
        super();
        this.debouncedSearch = _.debounce(this.searchAndMount.bind(this), 800);
    }

    public mounted() {

        this.shortcuts.bindShortcut(UiShortcuts.ACTION_MENU, () => {

            if (this.dialogVisible === true) {
                this.closeActionDialog();
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
        }

        else {
            this.searchMessage = '';
        }

    }

    private closeActionDialog() {
        this.dialogVisible = false;
    }

    private openActionDialog() {
        this.dialogVisible = true;

        // TODO: improve me
        setTimeout(() => {
            (this.$refs.queryTextField as any).focus();
        }, 600);
    }
}
