import Vue from 'vue';
import NavbarComponent from './navbar/NavbarComponent';
import LeftMenuComponent from './left-menu/LeftMenuComponent';
import MapComponent from './map/GeoMapComponent';
import AddLayerComponent from './new-layer-selector/AddLayerComponent';
import StatusBarComponent from "./status-bar/StatusBarComponent";
import StoreUpdaterComponent from "./store-updater/StoreUpdaterComponent";

// tag name -> component
Vue.component('navbar', NavbarComponent);
Vue.component('left-menu', LeftMenuComponent);
Vue.component('geo-map', MapComponent);
Vue.component('add-layer-selector', AddLayerComponent);
Vue.component('status-bar', StatusBarComponent);
Vue.component('store-updater', StoreUpdaterComponent);

