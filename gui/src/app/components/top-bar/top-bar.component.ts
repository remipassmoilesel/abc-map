import { Component, OnInit } from '@angular/core';
import {AllRoutes} from "../../routing/AllRoutes";

@Component({
  selector: 'abc-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  routes = AllRoutes;

  constructor() { }

  ngOnInit() {
  }

}
