import {StateStore} from './StateStore';
import {Project} from "../../../api/entities/Project";

// Warning: mutations must be synchronous

export const mutations = {

    UPDATE_PROJECT: (state: StateStore, newValue: Project) => {
        state.project = newValue;
    },

};
