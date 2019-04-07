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
import Layer from 'ol/layer/Layer';
import Map from 'ol/Map';
import Vector from 'ol/layer/Vector';
import Draw from 'ol/interaction/Draw';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import {FeatureCollection} from 'geojson';
import {Actions, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import DrawingToolChanged = MapModule.DrawingToolChanged;
import ActionTypes = MapModule.ActionTypes;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private geoJson = new GeoJSON();

  constructor(private store: Store<IMainState>,
              private actions$: Actions) {
  }

  public generateLayersFromProject(project: IProject): Layer[] {
    return _.map(project.layers, abcLayer => {
      return OpenLayersLayerFactory.toOlLayer(abcLayer);
    });
  }

  public listenDrawingToolChanged(): Observable<DrawingTool> {
    return this.actions$.pipe(
      ofType(ActionTypes.DRAWING_TOOL_CHANGED),
      map((action: DrawingToolChanged) => action.tool)
    );
  }

  public setDrawingTool(tool: DrawingTool): void {
    this.store.dispatch(new DrawingToolChanged(tool));
  }

  // TODO: remove/add only if layers change
  public updateLayers(project: IProject, map: Map) {
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
      if (lay instanceof Layer) {
        lay.getSource().on('change', listener);
      }
    });
  }

  public removeLayerSourceChangedListener(map: ol.Map, listener: ol.EventsListenerFunctionType) {
    const layers = map.getLayers().getArray();
    _.forEach(layers, lay => {
      if (lay instanceof Layer) {
        lay.un('change', listener);
      }
    });
  }

  public setDrawInteractionOnMap(tool: DrawingTool, map: Map) {
    this.removeAllDrawInteractions(map);

    if (tool.id === DrawingTools.None.id) {
      return;
    }

    const firstVector: Vector | undefined = _.find(map.getLayers().getArray(),
      lay => lay instanceof Vector) as Vector | undefined;

    if (!firstVector) {
      throw new Error('Vector layer not found');
    }

    map.addInteraction(
      new Draw({
        source: firstVector.getSource(),
        type: OpenLayersHelper.toolToGeometryType(tool),
      })
    );
  }

  private removeAllDrawInteractions(map: ol.Map) {
    const allInteractions = map.getInteractions().getArray();
    const drawInter = _.filter(allInteractions, inter => inter instanceof Draw);
    _.forEach(drawInter, inter => map.removeInteraction(inter));
  }

  public featuresToGeojson(features: Feature[]): FeatureCollection {
    return this.geoJson.writeFeaturesObject(features) as any;
  }
}
