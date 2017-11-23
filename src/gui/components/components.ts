import Vue from 'vue';
import NavbarComponent from './navbar/NavbarComponent';
import LeftMenuComponent from './left-menu/LeftMenuComponent';
import MapComponent from './map/MapComponent';
import WmsLayerSelectorComponent from './wms-layer-selector/WmsLayerSelectorComponent';

// tag name -> component
Vue.component('navbar', NavbarComponent);
Vue.component('left-menu', LeftMenuComponent);
Vue.component('geo-map', MapComponent);
Vue.component('wms-selector', WmsLayerSelectorComponent);

