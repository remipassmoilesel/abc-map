import Vue from 'vue';
import * as _ from 'lodash';
import Component from 'vue-class-component';
import {Clients} from '../../lib/clients/Clients';
import {uxActions} from "../components";
import {IUxSearchResult} from "../UiSearchableComponents";
import {UiShortcuts} from "../../lib/UiSortcuts";
import * as $ from 'jquery';
import './style.scss';

let instanceNumber = 0;

@Component({
    template: require('./template.html'),
})
export class ActionDialogComponent extends Vue {

    public shortcuts: UiShortcuts;
    public clients: Clients;

    public instanceId = instanceNumber++;
    public searchResultsId = `searchResults-${this.instanceId}`;
    public query: string = "";
    public searchMessage: string = "";
    public dialogVisible: boolean = false;

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
        const results: IUxSearchResult[] = uxActions.search(this.query);

        if (results.length < 1) {
            this.searchMessage = 'No results found';
        }

        else {
            this.emptySearchResults();
            _.forEach(results, (res, index) => {
                this.mountResult(res, index);
            });
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

    private emptySearchResults() {
        $(`#${this.searchResultsId}`).empty();
    }

    private mountResult(res: IUxSearchResult, id: number) {
        const resultId = `result-${id}`;

        // prepare component mount point
        const resultArea = $(`#${this.searchResultsId}`);

        const resultWrapper = $(`<div class="result-wrapper"></div>`)
        resultWrapper.append(`<div class="result-name">${res.name}</div>`);
        resultWrapper.append(`<div class="result-description">${res.component.description}</div>`);
        resultWrapper.append(`<div class="${resultId}"></div>`);

        resultArea.append(resultWrapper);

        // mount component
        res.component.$mount(`#${this.searchResultsId} .${resultId}`);
    }
}
