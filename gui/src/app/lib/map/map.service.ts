import {Injectable} from '@angular/core';
import {IMainState} from '../../store';
import {Store} from '@ngrx/store';
import {DrawingTool} from './DrawingTool';
import {Observable} from 'rxjs';
import {MapModule} from '../../store/map/map-actions';
import {Actions} from '@ngrx/effects';
import {IMapState} from '../../store/map/map-state';
import DrawingToolChanged = MapModule.DrawingToolChanged;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private store: Store<IMainState>,
              private actions$: Actions) {
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

}
