import Vue from 'vue';
import { ElectronUtilities } from '../api/dev/ElectronDevUtilities';
import { Logger } from '../api/dev/Logger';
// Import style
import './app.scss';
// import components
import './components';
// create vuex store
import { store } from './lib/store/store';
// import router
import { router } from './router';
// import ui lib
import * as ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';

const logger = Logger.getLogger('index.ts');
logger.info('Starting main app');

// initialize plugins
Vue.use(ElementUI, { locale });

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
