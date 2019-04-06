import {Injectable} from '@angular/core';
import {IProject} from 'abcmap-shared';
import * as _ from 'lodash';
import * as ol from 'openlayers';
import {OpenLayersLayerFactory} from "./OpenLayersLayerFactory";
import {IMainState} from "../../store";
import {Store} from "@ngrx/store";
import {DrawingTool} from "./DrawingTool";
import {Observable} from "rxjs";
import {MapModule} from "../../store/map/map-actions";
import DrawingToolChanged = MapModule.DrawingToolChanged;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private store: Store<IMainState>) {
  }

  public generateLayersFromProject(project: IProject): ol.layer.Base[] {
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

}
