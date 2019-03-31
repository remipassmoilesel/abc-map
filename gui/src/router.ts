import Vue from 'vue';
import Router from 'vue-router';
import MainMap from '@/views/MainMap.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/map'
    },
    {
      path: '/map',
      name: 'map',
      component: MainMap
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'), // lazy loaded
    },
  ],
});
