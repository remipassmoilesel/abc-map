import {Component, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {IMainState} from '../../store';
import {Store} from '@ngrx/store';
import {MapModule} from '../../store/map/map-actions';
import {Actions, ofType} from '@ngrx/effects';
import {Subscription} from 'rxjs';
import {RxUtils} from '../../lib/utils/RxUtils';
import ActiveForegroundColorChanged = MapModule.ActiveForegroundColorChanged;
import ActiveBackgroundColorChanged = MapModule.ActiveBackgroundColorChanged;
import ActionTypes = MapModule.ActionTypes;
import {take} from 'rxjs/operators';

declare type ColorType = 'foreground' | 'background';

@Component({
  selector: 'abc-draw-color-picker',
  templateUrl: './draw-color-picker.component.html',
  styleUrls: ['./draw-color-picker.component.scss']
})
export class DrawColorPickerComponent implements OnInit, OnDestroy {

  activeColorType: ColorType = 'foreground';
  activeForegroundColor = 'rgb(220,220,220)';
  activeBackgroundColor = 'rgb(220,220,220)';

  selectedColor: string = 'black';
  colorHistory: string[] = [];

  colorPresets = [
    'rgb(255,7,20)',
    'rgb(255,123,0)',
    'rgb(255,157,36)',
    'rgb(255,245,0)',
    'rgb(0,179,14)',
    'rgb(85,154,236)',
    'rgb(37,33,236)',
  ];

  colorChanged$?: Subscription;

  constructor(private store: Store<IMainState>,
              private actions$: Actions) {
  }

  ngOnInit() {
    this.fillColorHistory();
    this.listenColorChanges();
    this.initColors();
  }

  ngOnDestroy(): void {
    RxUtils.unsubscribe(this.colorChanged$);
  }

  onPresetSelected(color: string) {
    this.selectedColor = color;
    this.selectColor(this.selectedColor);
  }

  onColorChanged(color: string) {
    this.selectColor(color);
  }

  selectColor(color: string) {
    this.colorHistory.unshift(color);
    this.colorHistory.pop();

    if (this.activeColorType === 'foreground') {
      this.setForegroundColor(color);
    } else {
      this.setBackgroundColor(color);
    }
  }

  setForegroundColor(color: string) {
    this.store.dispatch(new ActiveForegroundColorChanged(color));
  }

  setBackgroundColor(color: string) {
    this.store.dispatch(new ActiveBackgroundColorChanged(color));
  }

  fillColorHistory() {
    _.times(6, i => this.colorHistory.push('rgb(220,220,220)'));
  }

  listenColorChanges() {
    this.colorChanged$ = this.actions$
      .pipe(
        ofType(
          ActionTypes.ACTIVE_FOREGROUND_COLOR_CHANGED,
          ActionTypes.ACTIVE_BACKGROUND_COLOR_CHANGED,
        ),
      )
      .subscribe((action: ActiveForegroundColorChanged | ActiveBackgroundColorChanged) => {
        if (action.type === ActionTypes.ACTIVE_FOREGROUND_COLOR_CHANGED) {
          this.activeForegroundColor = action.color;
        } else {
          this.activeBackgroundColor = action.color;
        }
      });
  }

  private initColors() {
    this.store.select(state => state.map)
      .pipe(take(1))
      .subscribe(mapState => {
        this.activeBackgroundColor = mapState.style.activeBackgroundColor;
        this.activeForegroundColor = mapState.style.activeForegroundColor;
      })
  }
}
