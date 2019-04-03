import Vue from 'vue';
import App from './App.vue';
import router from './router';
import * as loglevel from 'loglevel';
import BootstrapVue from 'bootstrap-vue';
import {mainStore} from '@/lib/store/store';
import {setDebugToolsInWindow} from '@/lib/utils/abcDebugTools';
import '@/mixins';

import './style.scss';

loglevel.setLevel('info');

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

setDebugToolsInWindow();

new Vue({
    router,
    store: mainStore,
    render: (h) => h(App),
}).$mount('#app');
