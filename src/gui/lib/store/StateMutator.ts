import { StateStore } from './StateStore';

export const mutations = {

    changeExampleValue(state: StateStore, newValue: string) {
        state.exampleValue = newValue;
    },

};
