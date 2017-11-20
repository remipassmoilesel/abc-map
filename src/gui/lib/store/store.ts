import Vue from 'vue';
import Vuex from 'vuex';
import { Logger } from '../../../api/dev/Logger';
import { mutations } from './StateMutator';
import { StateStore } from './StateStore';

const logger = Logger.getLogger('store.ts');
logger.info('Initializing Vuex store');

Vue.use(Vuex);

// define the current state
const state = new StateStore();

// create the Vuex instance by combining the state and mutations objects
// then export the Vuex store for use by our components
export const store = new Vuex.Store({
    mutations,
    state,
});
