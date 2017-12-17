import Component from 'vue-class-component';
import {IUxSearchResult} from "../UiSearchableComponents";
import './style.scss';
import {AbstractUiComponent} from "../AbstractUiComponent";

@Component({
    template: require('./template.html'),
    props: ['result'],
})
export class ActionDialogResultComponent extends AbstractUiComponent {

    public componentName: string = "Action dialog result";
    public componentDescription: string = "Display a result of Action dialog search.";
    public componentTagName: string = "action-dialog-result";

    public result: IUxSearchResult;

    constructor() {
        super();
    }

    public mounted() {
        console.log(this.result);
    }

}
