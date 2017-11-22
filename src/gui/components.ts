import Vue from 'vue';
import CellComponent from "./components/cell/CellComponent";
import NavbarComponent from "./components/navbar/NavbarComponent";
import LeftMenuComponent from "./components/left-menu/LeftMenuComponent";
import MapComponent from "./components/map/MapComponent";

// tag name -> component
Vue.component('cell', CellComponent);
Vue.component('navbar', NavbarComponent);
Vue.component('left-menu', LeftMenuComponent);
Vue.component('geo-map', MapComponent);

