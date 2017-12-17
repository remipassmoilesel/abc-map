import * as _ from "lodash";
import {UiComponent} from "./UiComponent";

export interface IUxSearchResult {
    name: string;
    score: number;
    component: UiComponent;
}

export class UiSearchableComponents {

    private components: UiComponent[];
    private nonSignificantWords: string[] = ['of', 'a', 'with', 'then'];

    constructor() {
        this.components = [];
    }

    public addComponent(instance: UiComponent) {
        this.checkIfNameIsUnique(instance);
        this.components.push(instance);
    }

    // TODO: suggest better queries, improve word search
    public search(query: string, max = 5): IUxSearchResult[] {

        const words = query.split(" ");

        // remove non-significants words, and pass them in lower case
        const significantWords: string[] = _.chain(words)
            .remove((w) => _.findIndex(this.nonSignificantWords, nsw => nsw === w))
            .map((w) => w.toLocaleLowerCase())
            .value();

        const matchingComponents: IUxSearchResult[] = [];

        _.forEach(this.components, (component) => {
            _.forEach(significantWords, (w) => {

                if (component.name.toLocaleLowerCase().indexOf(w) !== -1) {
                    this.addToScore(matchingComponents, component, 3);
                }

                if (component.description.toLocaleLowerCase().indexOf(w) !== -1) {
                    this.addToScore(matchingComponents, component, 2);
                }

            });
        });

        return _.chain(matchingComponents)
            .sort((m) => m.score)
            .reverse()
            .value()
            .slice(0, max);
    }

    private addToScore(matchingComponents: IUxSearchResult[], component: UiComponent, scoreToAdd: number) {

        // search if element was already added
        const previous = _.filter(matchingComponents, m => m.name === component.name);

        if (previous.length < 1) {
            matchingComponents.push({
                name: component.name,
                component,
                score: scoreToAdd,
            });
        } else {
            previous[0].score += scoreToAdd;
        }
    }

    private checkIfNameIsUnique(instance: UiComponent) {
        const sameNames = _.filter(this.components, i => i.name === instance.name);
        if (sameNames.length > 0) {
            throw new Error(`Name '${instance.name}' is not unique. Number found: ${sameNames.length}`)
        }
    }
}