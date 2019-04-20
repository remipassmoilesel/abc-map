import {Injectable} from '@angular/core';
import {IProject} from 'abcmap-shared';
import * as _ from 'lodash';
import {OpenLayersLayerFactory} from './OpenLayersLayerFactory';
import {IMainState} from '../../store';
import {Store} from '@ngrx/store';
import {DrawingTool, DrawingTools} from './DrawingTool';
import {Observable} from 'rxjs';
import {MapModule} from '../../store/map/map-actions';
import {OpenLayersHelper} from './OpenLayersHelper';
import {FeatureCollection} from 'geojson';
import {Actions, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import DrawingToolChanged = MapModule.DrawingToolChanged;
import ActionTypes = MapModule.ActionTypes;
import {IMapState} from '../../store/map/map-state';
import {OlDraw, OlFeature, OlGeoJSON, OlLayer, OlMap, OlVector} from '../OpenLayersImports';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private geoJson = new OlGeoJSON();

  constructor(private store: Store<IMainState>,
              private actions$: Actions) {
  }

  public generateLayersFromProject(project: IProject): OlLayer[] {
    return _.map(project.layers, abcLayer => {
      return OpenLayersLayerFactory.toOlLayer(abcLayer);
    });
  }

  public listenDrawingToolState(): Observable<DrawingTool> {
    return this.store.select(state => state.map.drawingTool);
  }

  public listenMapState(): Observable<IMapState> {
    return this.store.select(state => state.map);
  }

  public setDrawingTool(tool: DrawingTool): void {
    this.store.dispatch(new DrawingToolChanged(tool));
  }

  public updateMapFromProject(project: IProject, map: OlMap) {
    // TODO: make diff changes
    map.getLayers().clear();

    const layers = this.generateLayersFromProject(project);
    this.addAllLayers(map, layers);
  }

  public addAllLayers(map: ol.Map, layers: ol.layer.Layer[]) {
    _.forEach(layers, lay => {
      map.addLayer(lay);
    });
  }

  public addLayerSourceChangedListener(map: ol.Map, listener: ol.EventsListenerFunctionType): void {
    const layers = map.getLayers().getArray();
    _.forEach(layers, lay => {
      if (lay instanceof OlLayer) {
        lay.getSource().on('change', listener);
      }
    });
  }

  public removeLayerSourceChangedListener(map: ol.Map, listener: ol.EventsListenerFunctionType) {
    const layers = map.getLayers().getArray();
    _.forEach(layers, lay => {
      if (lay instanceof OlLayer) {
        lay.un('change', listener);
      }
    });
  }

  public setDrawInteractionOnMap(tool: DrawingTool, map: OlMap, vectorLayer: OlVector, listener: (event: any) => any) {
    this.removeAllDrawInteractions(map);

    if (tool.id === DrawingTools.None.id) {
      return;
    }

    const draw = new OlDraw({
      source: vectorLayer.getSource(),
      type: OpenLayersHelper.toolToGeometryType(tool),
    });

    draw.on('drawend', listener);

    map.addInteraction(draw);
  }

  public removeAllDrawInteractions(map: ol.Map) {
    const allInteractions = map.getInteractions().getArray();
    const drawInter = _.filter(allInteractions, inter => inter instanceof OlDraw);
    _.forEach(drawInter, inter => map.removeInteraction(inter));
  }

  public featuresToGeojson(features: OlFeature[]): FeatureCollection {
    return this.geoJson.writeFeaturesObject(features) as any;
  }

}
