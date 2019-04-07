import {Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from '../../lib/map/map.service';
import {Subscription} from 'rxjs';
import {RxUtils} from '../../lib/utils/RxUtils';
import {LoggerFactory} from '../../lib/utils/LoggerFactory';
import {ProjectService} from '../../lib/project/project.service';
import {OlEvent, olFromLonLat, OlMap, OlVectorSource, OlView} from '../../lib/OpenLayers';
import {OpenLayersHelper} from '../../lib/map/OpenLayersHelper';
import {DrawingTools} from '../../lib/map/DrawingTool';


@Component({
  selector: 'abc-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.scss']
})
export class MainMapComponent implements OnInit, OnDestroy {

  private logger = LoggerFactory.new('MainMapComponent');

  map?: OlMap;

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
    this.map = new OlMap({
      target: 'main-openlayers-map',
      layers: [],
      view: new OlView({
        center: olFromLonLat([37.41, 8.82]),
        zoom: 4,
      }),
    });
  }

  listenProjectState() {
    this.project$ = this.projectService.listenProjectLoaded()
      .subscribe(project => {
        if (!this.map || !project) {
          return;
        }
        this.logger.info('Updating layers ...');

        this.mapService.removeLayerSourceChangedListener(this.map, this.layerSourceChanged);
        this.mapService.updateLayers(project, this.map);
        this.mapService.setDrawingTool(DrawingTools.None);
        this.mapService.addLayerSourceChangedListener(this.map, this.layerSourceChanged);
      });
  }

  listenMapState() {
    this.drawingTool$ = this.mapService.listenDrawingToolChanged()
      .subscribe(tool => {
        if (!this.map) {
          return;
        }

        this.logger.info('Updating drawing tool ...');
        this.mapService.setDrawInteractionOnMap(tool, this.map);
      });
  }

  layerSourceChanged = (event: OlEvent) => {
    if (event.target instanceof OlVectorSource) {
      const source: OlVectorSource = event.target;
      const geojsonFeatures = this.mapService.featuresToGeojson(source.getFeatures());
      const layerId = OpenLayersHelper.getLayerId(source);

      this.projectService.updateVectorLayer(layerId, geojsonFeatures);
    }
  };

}
