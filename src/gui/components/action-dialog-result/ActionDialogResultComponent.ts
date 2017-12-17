import Vue from 'vue';
import * as _ from 'lodash';
import Component from 'vue-class-component';
import {uxSearchableComponents} from "../components";
import {IUxSearchResult} from "../UiSearchableComponents";
import {UiShortcuts} from "../../lib/UiSortcuts";
import './style.scss';

@Component({
    template: require('./template.html'),
    props: ['result'],
})
export class ActionDialogResultComponent extends Vue {

    public result: IUxSearchResult;

    constructor() {
        super();
    }

    public mounted() {

    }

}
