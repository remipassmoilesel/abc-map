import * as _ from "lodash";
import {IUxComponent} from "./IUxComponent";

interface IUxSearchResult {
    [name: string]: {
        score: number;
        action: IUxComponent;
    }
}

export class UxActions {

    private actions: IUxComponent[];
    private nonSignificantWords: string[] = ['of', 'a', 'with', 'then'];

    constructor() {
        this.actions = [];
    }

    public addAction(instance: IUxComponent) {
        this.actions.push(instance);
    }

    // TODO: suggest better queries, improve word search
    public search(query: string): IUxSearchResult[] {

        const words = query.split(" ");
        const significantWords = _.remove(words, (w) => _.includes(this.nonSignificantWords, w));

        const matchingActions: any = {};

        function addToScore(action: IUxComponent, number: number) {
            if(matchingActions[action.name]){
                matchingActions[action.name].score += number;
            } else {
                matchingActions[action.name] = {
                    action,
                    score: number,
                }
            }
        }

        _.forEach(this.actions, (action)=>{
            _.forEach(significantWords, (w)=>{
                if(action.name.indexOf(w) !== -1){
                    addToScore(action, 3);
                }else if (action.description.indexOf(w) !== -1){
                    addToScore(action, 2);
                }
            });
        });

        return _.sortBy(matchingActions, (m)=> m.score);
    }

}