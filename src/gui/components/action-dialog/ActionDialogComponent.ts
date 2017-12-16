import Vue from 'vue';
import * as _ from 'lodash';
import Component from 'vue-class-component';
import {Clients} from '../../lib/clients/Clients';
import {AbstractMapLayer} from "../../../api/entities/layers/AbstractMapLayer";
import './style.scss';
import {uxActions} from "../components";
import {IUxSearchResult} from "../UiActions";
import {UiShortcuts} from "../../lib/UiSortcuts";

@Component({
    template: require('./template.html'),
})
export class ActionDialogComponent extends Vue {

    public shortcuts: UiShortcuts;
    public clients: Clients;
    public layers: AbstractMapLayer[] = [];
    public query: string = "";

    public dialogVisible: boolean = false;

    public mounted() {

        this.shortcuts.bindShortcut('ctrl+a', (ev) => {

            if (this.dialogVisible === true) {
                this.closeActionDialog();
            } else {
                this.openActionDialog();
            }
        });

    }

    public onChange() {
        console.log('onChange');
        _.debounce(this.searchAndMount.bind(this));
    }

    public searchAndMount() {
        console.log('searchAndMount');
        const results: IUxSearchResult[] = uxActions.search(this.query);
        _.forEach(results, (res) => {
            console.log(res);
        });
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
