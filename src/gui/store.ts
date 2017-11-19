import Vue from 'vue'
import Vuex from 'vuex'
import {Logger} from "../api/dev/Logger";

const logger = Logger.getLogger('store.ts');
logger.info('Initializing Vuex store');

Vue.use(Vuex);

// the root, initial state object
const state = {
    menuActive: ''
};

// define the possible mutations that can be applied to our state
const mutations = {};

// create the Vuex instance by combining the state and mutations objects
// then export the Vuex store for use by our components
export const store = new Vuex.Store({
    state,
    mutations
});