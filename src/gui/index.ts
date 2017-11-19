import Vue from 'vue';
import VueRouter from 'vue-router';
import CellComponent from "./components/cell/CellComponent";
import MainView from "./views/main/MainView";
import {ElectronUtilities} from "../api/dev/ElectronDevUtilities";
import {Logger} from "../api/dev/Logger";
// import vuetify
import 'vuetify';
// Import style
import './index.scss';

const logger = Logger.getLogger('index.ts');
logger.info('Starting main app');

// install dev tools
if (ElectronUtilities.isDevMode()) {
    logger.info('Development mode enabled');
    ElectronUtilities.setupDevtron();
}

// tag name -> component
Vue.component('cell', CellComponent);

// declare routes and router
const routes = [
    {path: '/main', component: MainView}
];

// initializing router
Vue.use(VueRouter);
const router = new VueRouter({
    routes,
});

// declare vue app
let v = new Vue({
    el: '#app',
    router,
    template: require('./main.html'),
});
