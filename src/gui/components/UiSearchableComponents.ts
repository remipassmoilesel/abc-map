import * as _ from "lodash";
import {UiComponent} from "./UiComponent";

export interface IUxSearchResult {
    name: string;
    score: number;
    component: UiComponent;
}

export class UiSearchableComponents {

    private actions: UiComponent[];
    private nonSignificantWords: string[] = ['of', 'a', 'with', 'then'];

    constructor() {
        this.actions = [];
    }

    public addAction(instance: UiComponent) {
        this.actions.push(instance);
    }

    // TODO: suggest better queries, improve word search
    public search(query: string, max = 5): IUxSearchResult[] {

        const words = query.split(" ");
        const significantWords = _.remove(words, (w) => _.includes(this.nonSignificantWords, w));

        const matchingComponents: IUxSearchResult[] = [];

        _.forEach(this.actions, (action) => {
            _.forEach(significantWords, (w) => {
                if (action.name.indexOf(w) !== -1) {
                    this.addToScore(matchingComponents, action, 3);
                } else if (action.description.indexOf(w) !== -1) {
                    this.addToScore(matchingComponents, action, 2);
                }
            });
        });

        return _.sortBy(matchingComponents, (m) => m.score).slice(0, max);
    }

    private addToScore(matchingComponents: IUxSearchResult[], component: UiComponent, number: number) {

        // search if element was already added
        const previous = _.filter(matchingComponents, m => m.name === component.name);

        console.log(previous);

        if (previous.length < 1) {
            matchingComponents.push({
                name: component.name,
                component,
                score: number,
            });
        } else {
            previous[0].score += number;
        }
    }

}