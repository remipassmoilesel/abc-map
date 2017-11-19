import Vue from 'vue';
import {ElectronUtilities} from "../api/dev/ElectronDevUtilities";
import {Logger} from "../api/dev/Logger";
import {router} from "./router";
// Import style
import './index.scss';
// import components
import './components';
// import vuetify
import Vuetify = require("vuetify");

const logger = Logger.getLogger('index.ts');
logger.info('Starting main app');

// install dev tools
if (ElectronUtilities.isDevMode()) {
    logger.info('Development mode enabled');
    ElectronUtilities.setupDevtron();
}

Vue.use(Vuetify);

// declare vue app
let v = new Vue({
    el: '#app',
    router,
    template: require('./main.html'),
});
