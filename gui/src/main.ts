import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import {mainStore} from "@/lib/store/store";
import "@/mixins";
import {setDebugToolsInWindow} from "@/lib/debugTools";
import './style.scss';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

setDebugToolsInWindow();

new Vue({
    router,
    store: mainStore,
    render: (h) => h(App),
}).$mount('#app');
