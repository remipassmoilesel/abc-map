import { Component, OnInit } from '@angular/core';
import {DrawingTool} from "../../lib/DrawingTool";
import {MapService} from "../../lib/map/map.service";

@Component({
  selector: 'abc-drawing-toolbox',
  templateUrl: './drawing-toolbox.component.html',
  styleUrls: ['./drawing-toolbox.component.scss']
})
export class DrawingToolboxComponent implements OnInit {

  tools = DrawingTool;

  constructor(private mapService: MapService) { }

  ngOnInit() {
  }

  setTool(param: DrawingTool) {
    this.mapService.setDrawingTool(param);
  }
}
