import Vue from 'vue';
import {ElectronUtilities} from '../api/dev/ElectronDevUtilities';
import {Logger} from '../api/dev/Logger';
// create vuex store
import {store} from './lib/store';
// import router
import {router} from './lib/router';
// import ui lib
import * as ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
// import components
import './components/components';
// Import style
import './views/app/app.scss';
// Import mixins
import {clients} from './lib/mixins';
import './lib/mixins';

const logger = Logger.getLogger('gui/main.ts');
logger.info('Starting main app');

// initialize plugins
Vue.use(ElementUI, {locale});

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
    template: require('./views/app/app.html'),
});
