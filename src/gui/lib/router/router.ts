import Vue from 'vue';
import VueRouter from 'vue-router';
import {Logger} from '../../../api/dev/Logger';

const logger = Logger.getLogger('router.ts');
logger.info('Initializing Vue router');

// declare routes and router
const routes: any[] = [
    // {path: Routes.MAIN, component: MainView},
];

// initializing router
Vue.use(VueRouter);
export const router = new VueRouter({
    routes,
});
