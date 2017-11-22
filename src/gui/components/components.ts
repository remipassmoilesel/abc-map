import Vue from 'vue';
import CellComponent from "./cell/CellComponent";
import NavbarComponent from "./navbar/NavbarComponent";
import LeftMenuComponent from "./left-menu/LeftMenuComponent";
import MapComponent from "./map/MapComponent";

// tag name -> component
Vue.component('cell', CellComponent);
Vue.component('navbar', NavbarComponent);
Vue.component('left-menu', LeftMenuComponent);
Vue.component('geo-map', MapComponent);

