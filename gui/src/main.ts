import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import {mainStore} from "@/lib/store/store";
import "@/mixins";
import './style.scss';
import {setDebugTools} from "@/lib/debugTools";

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

setDebugTools();

new Vue({
    router,
    store: mainStore,
    render: (h) => h(App),
}).$mount('#app');
