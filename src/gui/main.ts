import Vue from 'vue';
import {ElectronUtilities} from "../api/dev/ElectronDevUtilities";
import {Logger} from "../api/dev/Logger";
import {router} from "./router";
// Import style
import './app.scss';
// import components
import './components';
// import ui lib
import Buefy from 'buefy'

Vue.use(Buefy);

const logger = Logger.getLogger('index.ts');
logger.info('Starting main app');

// install dev tools
if (ElectronUtilities.isDevMode()) {
    logger.info('Development mode enabled');
    ElectronUtilities.setupDevtron();
}

// declare main vue app
let v = new Vue({
    el: '#app',
    router,
    template: require('./app.html'),
});
