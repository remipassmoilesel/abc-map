import {Component, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import * as ol from 'openlayers';
import {MapService} from '../../lib/map/map.service';
import {Subscription} from 'rxjs';
import {RxUtils} from '../../lib/utils/RxUtils';
import {IProject} from 'abcmap-shared';
import {LoggerFactory} from '../../lib/utils/LoggerFactory';
import {ProjectService} from '../../lib/project/project.service';
import {DrawingTool, DrawingTools} from '../../lib/map/DrawingTool';
import {OpenLayersHelper} from '../../lib/map/OpenLayersHelper';

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
    this.listenProjectState();
    this.listenMapState();
  }

  ngOnDestroy() {
    RxUtils.unsubscribe(this.project$);
    RxUtils.unsubscribe(this.drawingTool$);
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

  listenProjectState() {
    this.project$ = this.projectService.listenProjectUpdatesFromStore()
      .subscribe(project => {
        if (!this.map || !project) {
          return;
        }
        this.logger.info('Updating layers ...');

        console.log(this.map.getLayers().getArray())

        this.mapService.removeLayerSourceChangedListener(this.map, this.layersChanged);
        this.mapService.updateLayers(project, this.map);
        this.mapService.addLayerSourceChangedListener(this.map, this.layersChanged);
      });
  }

  listenMapState() {
    this.drawingTool$ = this.mapService.listenDrawingToolChanged()
      .subscribe(tool => {
        if (!this.map) {
          return;
        }
        this.mapService.setDrawInteractionOnMap(tool, this.map);
      });
  }

  layersChanged = (event: ol.events.Event) => {
    console.log(event);
  }

}
