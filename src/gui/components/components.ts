import Vue from 'vue';
import NavbarComponent from './navbar/NavbarComponent';
import LeftMenuComponent from './left-menu/LeftMenuComponent';
import MapComponent from './map/GeoMapComponent';
import WmsLayerSelectorComponent from './new-layer-selector/NewLayerSelectorComponent';
import StatusBarComponent from "./status-bar/StatusBarComponent";
import StoreUpdaterComponent from "./store-updater/StoreUpdaterComponent";

// tag name -> component
Vue.component('navbar', NavbarComponent);
Vue.component('left-menu', LeftMenuComponent);
Vue.component('geo-map', MapComponent);
Vue.component('wms-selector', WmsLayerSelectorComponent);
Vue.component('status-bar', StatusBarComponent);
Vue.component('store-updater', StoreUpdaterComponent);

