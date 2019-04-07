import {Injectable} from '@angular/core';
import {IProject} from 'abcmap-shared';
import * as _ from 'lodash';
import * as ol from 'openlayers';
import {OpenLayersLayerFactory} from './OpenLayersLayerFactory';
import {IMainState} from '../../store';
import {Store} from '@ngrx/store';
import {DrawingTool, DrawingTools} from './DrawingTool';
import {Observable} from 'rxjs';
import {MapModule} from '../../store/map/map-actions';
import {OpenLayersHelper} from './OpenLayersHelper';
import DrawingToolChanged = MapModule.DrawingToolChanged;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private store: Store<IMainState>) {
  }

  public generateLayersFromProject(project: IProject): ol.layer.Layer[] {
    return _.map(project.layers, abcLayer => {
      return OpenLayersLayerFactory.toOlLayer(abcLayer);
    });
  }

  public listenDrawingToolChanged(): Observable<DrawingTool> {
    return this.store.select(state => state.map.drawingTool);
  }

  public setDrawingTool(tool: DrawingTool): void {
    this.store.dispatch(new DrawingToolChanged(tool));
  }

  public updateLayers(project: IProject, map: ol.Map) {
    const layers = this.generateLayersFromProject(project);

    // TODO: remove/add only if layers change
    this.removeAllLayers(map);
    this.addAllLayers(map, layers);
  }

  public addAllLayers(map: ol.Map, layers: ol.layer.Layer[]) {
    _.forEach(layers, lay => map.addLayer(lay));
  }

  public removeAllLayers(map: ol.Map) {
    const layers = map.getLayers().getArray();
    _.forEach(layers, lay => map.removeLayer(lay));
  }

  public addLayerSourceChangedListener(map: ol.Map, listener: ol.EventsListenerFunctionType): void {
    const layers = map.getLayers().getArray();
    _.forEach(layers, lay => {
      if (lay instanceof ol.layer.Layer) {
        lay.getSource().on('change', listener);
      }
    });
  }

  public removeLayerSourceChangedListener(map: ol.Map, listener: ol.EventsListenerFunctionType) {
    const layers = map.getLayers().getArray();
    _.forEach(layers, lay => {
      if (lay instanceof ol.layer.Layer) {
        lay.un('change', listener);
      }
    });
  }

  public setDrawInteractionOnMap(tool: DrawingTool, map: ol.Map) {
    this.removeAllDrawInteractions(map);

    if (tool.id === DrawingTools.None.id) {
      return;
    }

    const firstVector: ol.layer.Vector | undefined = _.find(map.getLayers().getArray(),
      lay => lay instanceof ol.layer.Vector) as ol.layer.Vector | undefined;

    if (!firstVector) {
      throw new Error('Vector layer not found');
    }

    map.addInteraction(
      new ol.interaction.Draw({
        source: firstVector.getSource(),
        type: OpenLayersHelper.toolToGeometryType(tool),
      })
    );
  }

  private removeAllDrawInteractions(map: ol.Map) {
    const allInteractions = map.getInteractions().getArray();
    const drawInter = _.filter(allInteractions, inter => inter instanceof ol.interaction.Draw);
    _.forEach(drawInter, inter => map.removeInteraction(inter));
  }

}
