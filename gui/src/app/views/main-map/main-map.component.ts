import {Component, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import * as ol from 'openlayers';
import {MapService} from '../../lib/map/map.service';
import {Subscription} from 'rxjs';
import {RxUtils} from '../../lib/utils/RxUtils';
import {IProject} from 'abcmap-shared';
import {LoggerFactory} from '../../lib/LoggerFactory';
import {ProjectService} from "../../lib/project/project.service";
import {DrawingTool} from "../../lib/DrawingTool";

@Component({
  selector: 'abc-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.scss']
})
export class MainMapComponent implements OnInit, OnDestroy {

  private logger = LoggerFactory.new('MainMapComponent');

  map?: ol.Map;

  project$?: Subscription;
  drawingTool$?: Subscription;

  constructor(private mapService: MapService,
              private projectService: ProjectService) {
  }

  ngOnInit() {
    this.setupMap();
    this.project$ = this.projectService.listenProjectUpdates()
      .subscribe(project => this.updateLayers(project));

    this.drawingTool$ = this.mapService.listenDrawingToolChanged()
      .subscribe(tool => this.setDrawingTool(tool))
  }

  ngOnDestroy() {
    RxUtils.unsubscribe(this.project$);
  }

  updateLayers(project?: IProject) {
    if (!this.map || !project) {
      return;
    }
    this.logger.info('Updating layers ...');

    const _map = this.map;
    const olLayers = this.mapService.generateLayersFromProject(project);

    // TODO: remove/add only if layers change
    _map.getLayers().forEach(lay => _map.removeLayer(lay));
    _.forEach(olLayers, lay => _map.addLayer(lay));
  }

  setupMap() {
    this.map = new ol.Map({
      target: 'main-openlayers-map',
      layers: [],
      view: new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4,
      }),
    });
  }

  private setDrawingTool(tool: DrawingTool) {

  }
}
