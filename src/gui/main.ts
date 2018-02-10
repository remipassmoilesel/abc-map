import {Toaster} from './lib/Toaster';
import Vue from 'vue';
import {Logger} from '../api/dev/Logger';
import {GuiDevUtilities} from './lib/GuiDevUtilities';
import * as sourceMapSupport from 'source-map-support';
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

sourceMapSupport.install();

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
if (GuiDevUtilities.isDevMode()) {
    // FIXME: not working anymore
    // logger.info('Setting up devtron ...');
    // GuiDevUtilities.setupDevtron();

    logger.info('You can install devtron using command: require("devtron").install()');
}

// declare main vue app
let v = new Vue({
    el: '#app',
    router,
    store,
    template: require('./public/app.html'),
});
