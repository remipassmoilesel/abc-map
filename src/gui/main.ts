import {Toaster} from './lib/Toaster';
import Vue from 'vue';
import {ElectronUtilities} from '../api/dev/ElectronDevUtilities';
import {Logger} from '../api/dev/Logger';

import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

// create vuex store
import {store} from './lib/store/store';
// import router
import {router} from './lib/router/router';
// import ui lib
import * as ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
// import components
import './components/components';
// Import style
import './views/style/main.scss';
// Import mixins
import './lib/mixins';
// Import tests
import './tests/tests.ts';

const logger = Logger.getLogger('gui/main.ts');
logger.info('Starting main app');

Vue.config.errorHandler = (err, vm, info) => {
    console.error('Vuejs error handler. Error, Vm, info: ');
    console.error(err);
    console.error(vm);
    console.error(info);
    Toaster.error(JSON.stringify(info));
};

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
