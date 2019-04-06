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
import {OpenLayersHelper} from "../../lib/map/OpenLayersHelper";

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
    this.project$ = this.projectService.listenProjectUpdates()
      .subscribe(project => {
        if (!this.map || !project) {
          return;
        }
        this.updateLayers(project, this.map);
      });
  }

  listenMapState() {
    this.drawingTool$ = this.mapService.listenDrawingToolChanged()
      .subscribe(tool => {
        if (!this.map) {
          return;
        }
        this.setDrawingTool(tool, this.map)
      })
  }

  updateLayers(project: IProject, map: ol.Map) {
    this.logger.info('Updating layers ...');
    const olLayers = this.mapService.generateLayersFromProject(project);

    // TODO: remove/add only if layers change
    const currentLayers = map.getLayers().getArray();
    _.forEach(currentLayers, lay => map.removeLayer(lay));
    _.forEach(olLayers, lay => map.addLayer(lay));
  }

  setDrawingTool(tool: DrawingTool, map: ol.Map) {
    this.removeAllDrawInteractions(map);

    if (tool === DrawingTool.None) {
      return;
    }

    const firstVector: ol.layer.Vector | undefined = _.find(map.getLayers().getArray(),
      lay => lay instanceof ol.layer.Vector) as ol.layer.Vector | undefined;

    if (!firstVector) {
      throw new Error("Vector layer not found")
    }

    map.addInteraction(
      new ol.interaction.Draw({
        source: firstVector.getSource(),
        type: OpenLayersHelper.toolToGeometryType(tool),
      })
    )
  }

  removeAllDrawInteractions(map: ol.Map) {
    const allInteractions = map.getInteractions().getArray();
    const drawInter = _.filter(allInteractions, inter => inter instanceof ol.interaction.Draw);
    _.forEach(drawInter, inter => map.removeInteraction(inter));
  }
}
