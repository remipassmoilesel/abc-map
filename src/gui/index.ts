import Vue from 'vue';
import VueRouter from 'vue-router';
import './index.scss';
import CellComponent from "./components/cell/CellComponent";
import MainView from "./views/main/MainView";

// tag name -> component
Vue.component('cell', CellComponent);

// declare routes and router
const routes = [
    { path: '/main', component: MainView}
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
