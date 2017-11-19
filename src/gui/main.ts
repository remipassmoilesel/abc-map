import Vue from 'vue';
import {ElectronUtilities} from "../api/dev/ElectronDevUtilities";
import {Logger} from "../api/dev/Logger";
// Import style
import './app.scss';
// import ui lib
import Buefy from 'buefy'
// import vuejs router
import {router} from "./router";
// create vuex store
import {store} from './store';
// import components
import './components';

const logger = Logger.getLogger('index.ts');
logger.info('Starting main app');

// initialize plugins
Vue.use(Buefy);

// install dev tools
if (ElectronUtilities.isDevMode()) {
    logger.info('Development mode enabled');
    ElectronUtilities.setupDevtron();
}

// declare main vue app
let v = new Vue({
    el: '#app',
    router,
    store,
    template: require('./app.html'),
});
