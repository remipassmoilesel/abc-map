import Vue from 'vue';
import VueRouter from 'vue-router';
import {Routes} from "./lib/Routes";
import MainView from "./views/main/MainView";

// declare routes and router
const routes = [
    {path: Routes.MAIN, component: MainView}
];

// initializing router
Vue.use(VueRouter);
export const router = new VueRouter({
    routes,
});