import {Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from '../../lib/map/map.service';
import {Subscription} from 'rxjs';
import {RxUtils} from '../../lib/utils/RxUtils';
import {LoggerFactory} from '../../lib/utils/LoggerFactory';
import {ProjectService} from '../../lib/project/project.service';
import {DrawEvent, OlEvent, olFromLonLat, OlMap, OlVectorSource, OlView} from '../../lib/OpenLayersImports';
import {OpenLayersHelper} from '../../lib/map/OpenLayersHelper';
import {DrawingTools} from '../../lib/map/DrawingTool';
import {Actions, ofType} from '@ngrx/effects';
import {MapModule} from '../../store/map/map-actions';
import ActionTypes = MapModule.ActionTypes;
import ActiveForegroundColorChanged = MapModule.ActiveForegroundColorChanged;
import ActiveBackgroundColorChanged = MapModule.ActiveBackgroundColorChanged;
import {IAbcStyleContainer} from '../../lib/map/AbcStyles';
import * as _ from 'lodash';


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
  colorChanged$?: Subscription;

  currentStyle: IAbcStyleContainer = {
    foreground: 'rgb(0,0,0)',
    background: 'rgb(0,0,0)',
  };

  constructor(private mapService: MapService,
              private actions$: Actions,
              private projectService: ProjectService) {
  }

  ngOnInit() {
    this.setupMap();
    this.listenProjectState();
    this.listenDrawingToolState();
    this.listenStyleState();
  }

  ngOnDestroy() {
    RxUtils.unsubscribe(this.project$);
    RxUtils.unsubscribe(this.drawingTool$);
    RxUtils.unsubscribe(this.colorChanged$);
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

        this.mapService.removeLayerSourceChangedListener(this.map, this.onLayerSourceChange);
        this.mapService.updateLayers(project, this.map);
        this.mapService.setDrawingTool(DrawingTools.None);
        this.mapService.addLayerSourceChangedListener(this.map, this.onLayerSourceChange);
      });
  }

  listenDrawingToolState() {
    this.drawingTool$ = this.mapService.listenDrawingToolChanged()
      .subscribe(tool => {
        if (!this.map) {
          return;
        }

        this.logger.info('Updating drawing tool ...');
        this.mapService.setDrawInteractionOnMap(tool, this.map, this.onDrawEnd);
      });
  }

  onDrawEnd = (event: DrawEvent) => {
    OpenLayersHelper.setStyle(event.feature, _.cloneDeep(this.currentStyle));
  };

  onLayerSourceChange = (event: OlEvent) => {
    if (event.target instanceof OlVectorSource) {
      const source: OlVectorSource = event.target;
      const geojsonFeatures = this.mapService.featuresToGeojson(source.getFeatures());
      const layerId = OpenLayersHelper.getLayerId(source);

      this.projectService.updateVectorLayer(layerId, geojsonFeatures);
    }
  };

  listenStyleState() {
    this.colorChanged$ = this.actions$
      .pipe(
        ofType(
          ActionTypes.ACTIVE_FOREGROUND_COLOR_CHANGED,
          ActionTypes.ACTIVE_BACKGROUND_COLOR_CHANGED,
        ),
      )
      .subscribe((action: ActiveForegroundColorChanged | ActiveBackgroundColorChanged) => {
        if (action.type === ActionTypes.ACTIVE_FOREGROUND_COLOR_CHANGED) {
          this.currentStyle.foreground = action.color;
        } else {
          this.currentStyle.background = action.color;
        }
      });
  }
}
