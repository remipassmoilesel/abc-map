import Vue from 'vue';
import NavbarComponent from './navbar/NavbarComponent';
import LeftMenuComponent from './left-menu/LeftMenuComponent';
import MapComponent from './map/GeoMapComponent';
import AddLayerComponent from './add-layer/AddLayerComponent';
import StatusBarComponent from "./status-bar/StatusBarComponent";
import StoreUpdaterComponent from "./store-updater/StoreUpdaterComponent";
import LayerSelectorComponent from "./layer-selector/LayerSelectorComponent";
import ImportDataSelectorComponent from "./import-data-selector/ImportDataComponent";
import GeoSearchComponent from "./geo-search/GeoSearchComponent";

// tag name -> component
Vue.component('navbar', NavbarComponent);
Vue.component('left-menu', LeftMenuComponent);
Vue.component('geo-map', MapComponent);
Vue.component('add-layer-selector', AddLayerComponent);
Vue.component('layer-selector', LayerSelectorComponent);
Vue.component('status-bar', StatusBarComponent);
Vue.component('store-updater', StoreUpdaterComponent);
Vue.component('import-data-selector', ImportDataSelectorComponent);
Vue.component('geo-search', GeoSearchComponent);

