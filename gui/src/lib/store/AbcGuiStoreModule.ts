import {Module} from "vuex";
import {IRootState} from "@/lib/store/store";


export interface IGuiState {
    modals: {
        projectNotFound: boolean;
    }
}

export enum GuiMutations {
    PROJECT_NOT_FOUND_MODAL_VISIBLE = 'PROJECT_NOT_FOUND_MODAL_VISIBLE'
}

export enum GuiActions {
    PROJECT_NOT_FOUND_MODAL_VISIBLE = 'PROJECT_NOT_FOUND_MODAL_VISIBLE'
}

export const abcGuiModule: Module<IGuiState, IRootState> = {
    state: {
        modals: {
            projectNotFound: false,
        }
    },
    getters: {
        projectNotFound: (state, getters, rootState, rootGetters) => {
            return state.modals.projectNotFound;
        }
    },
    actions: {
        [GuiActions.PROJECT_NOT_FOUND_MODAL_VISIBLE]: (context: any, value: boolean) => {
            context.commit(GuiMutations.PROJECT_NOT_FOUND_MODAL_VISIBLE, {value});
        },
    },
    mutations: {
        [GuiMutations.PROJECT_NOT_FOUND_MODAL_VISIBLE]: (state: IGuiState, payload: { value: boolean }) => {
            state.modals.projectNotFound = payload.value;
        },
    },
};
