import {Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from '../../lib/map/map.service';
import {Subscription} from 'rxjs';
import {RxUtils} from '../../lib/utils/RxUtils';
import {LoggerFactory} from '../../lib/utils/LoggerFactory';
import {ProjectService} from '../../lib/project/project.service';
import Map from 'ol/Map';
import View from 'ol/View';
import Event from 'ol/events/Event';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

const {fromLonLat} = require('ol/proj');

@Component({
  selector: 'abc-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.scss']
})
export class MainMapComponent implements OnInit, OnDestroy {

  private logger = LoggerFactory.new('MainMapComponent');

  map?: Map;

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
    this.map = new Map({
      target: 'main-openlayers-map',
      layers: [],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
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

        this.mapService.removeLayerSourceChangedListener(this.map, this.layerSourceChanged);
        this.mapService.updateLayers(project, this.map);
        this.mapService.addLayerSourceChangedListener(this.map, this.layerSourceChanged);
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

  layerSourceChanged = (event: Event) => {
    if(event.target instanceof VectorSource){
      const source: VectorSource = event.target;
      const geojsonFeatures = this.mapService.featuresToGeojson(source.getFeatures());
      console.log(geojsonFeatures)
    }
  };

}
