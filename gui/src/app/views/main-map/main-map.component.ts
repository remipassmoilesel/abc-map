import {Component, OnDestroy, OnInit} from '@angular/core';
import {MapService} from '../../lib/map/map.service';
import {Subscription} from 'rxjs';
import {RxUtils} from '../../lib/utils/RxUtils';
import {LoggerFactory} from '../../lib/utils/LoggerFactory';
import {ProjectService} from '../../lib/project/project.service';
import {DrawEvent, OlEvent, olFromLonLat, OlMap, OlVectorSource, OlView} from '../../lib/OpenLayersImports';
import {OpenLayersHelper} from '../../lib/map/OpenLayersHelper';
import {DrawingTool, DrawingTools} from '../../lib/map/DrawingTool';
import {Actions, ofType} from '@ngrx/effects';
import {MapModule} from '../../store/map/map-actions';
import {IAbcStyleContainer} from '../../lib/map/AbcStyles';
import * as _ from 'lodash';
import {IMainState} from '../../store';
import {Store} from '@ngrx/store';
import {flatMap, take} from 'rxjs/operators';
import {zip} from 'rxjs/internal/observable/zip';
import {of} from 'rxjs/internal/observable/of';
import {IProject} from 'abcmap-shared';
import ActionTypes = MapModule.ActionTypes;
import ActiveForegroundColorChanged = MapModule.ActiveForegroundColorChanged;
import ActiveBackgroundColorChanged = MapModule.ActiveBackgroundColorChanged;
import {OlMapHelper} from './OlMapHelper';


@Component({
  selector: 'abc-main-map',
  template: `
    <div id="main-openlayers-map"></div>
  `,
  styleUrls: ['./main-map.component.scss']
})
export class MainMapComponent implements OnInit, OnDestroy {

  private logger = LoggerFactory.new('MainMapComponent');

  map?: OlMap;

  currentStyle: IAbcStyleContainer = {
    foreground: 'rgba(0,0,0)',
    background: 'rgba(0,0,0)',
    strokeWidth: 7,
  };

  drawingTool$?: Subscription;
  colorChanged$?: Subscription;
  project$?: Subscription;

  constructor(private mapService: MapService,
              private actions$: Actions,
              private store: Store<IMainState>,
              private projectService: ProjectService) {
  }

  ngOnInit() {
    this.initMap();
    this.updateMapOnProjectChange();
    this.updateDrawingInteractionOnToolChange();
    this.initStyle();
    this.listenStyleState();
  }

  ngOnDestroy() {
    RxUtils.unsubscribe(this.project$);
    RxUtils.unsubscribe(this.drawingTool$);
    RxUtils.unsubscribe(this.colorChanged$);
  }

  initMap() {
    this.map = new OlMap({
      target: 'main-openlayers-map',
      layers: [],
      view: new OlView({
        center: olFromLonLat([37.41, 8.82]),
        zoom: 4,
      }),
    });
  }

  updateMapOnProjectChange() {
    this.project$ = this.projectService.listenProjectState()
      .pipe(flatMap(project => zip(
        of(project),
        this.mapService.listenDrawingToolState().pipe(take(1))
      )))
      .subscribe(([project, tool]) => {
        if (project && this.map) {
          OlMapHelper.removeLayerSourceChangedListener(this.map, this.onLayerSourceChange);
          OlMapHelper.updateMapFromProject(project, this.map);
          OlMapHelper.addLayerSourceChangedListener(this.map, this.onLayerSourceChange);
          this.setDrawingInteraction(tool, project);
        }
      });
  }

  updateDrawingInteractionOnToolChange() {
    this.drawingTool$ = this.mapService.listenDrawingToolState()
      .pipe(
        flatMap(tool =>
          zip(
            of(tool),
            this.projectService.listenProjectState().pipe(take(1))
          ))
      )
      .subscribe(([tool, project]) => {
        this.setDrawingInteraction(tool, project);
      });
  }

  setDrawingInteraction(tool: DrawingTool, project: IProject | undefined) {
    if (!this.map || !project || !project.activeLayerId) {
      return;
    }
    this.logger.info('Updating drawing tool ...');

    const layer = OpenLayersHelper.findVectorLayer(this.map, project.activeLayerId);
    if (!layer) {
      OlMapHelper.removeAllDrawInteractions(this.map);
    } else {
      OlMapHelper.setDrawInteractionOnMap(tool, this.map, layer, this.onDrawEnd);
    }

  }

  initStyle() {
    this.store
      .select(state => state.map.activeStyle)
      .pipe(take(1))
      .subscribe(style => {
        this.currentStyle = style;
      });
  }

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

  onDrawEnd = (event: DrawEvent) => {
    OpenLayersHelper.setStyle(event.feature, _.cloneDeep(this.currentStyle));
  };

  onLayerSourceChange = (event: OlEvent) => {
    if (event.target instanceof OlVectorSource) {
      const source: OlVectorSource = event.target;
      const geojsonFeatures = OlMapHelper.featuresToGeojson(source.getFeatures());
      const layerId = OpenLayersHelper.getLayerId(source);
      if(!layerId){
        throw new Error('Layer id is undefined');
      }
      this.projectService.updateVectorLayer(layerId, geojsonFeatures);
    }
  };

}
