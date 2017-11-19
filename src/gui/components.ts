import Vue from 'vue';
import CellComponent from "./components/cell/CellComponent";
import NavbarComponent from "./components/navbar/NavbarComponent";
import NavbarMenuComponent from "./components/navbar-menu/NavbarMenuComponent";

// tag name -> component
Vue.component('cell', CellComponent);
Vue.component('navbar', NavbarComponent);
Vue.component('navbar-menu', NavbarMenuComponent);

