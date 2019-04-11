import {Component, OnDestroy, OnInit} from '@angular/core';
import {RxUtils} from '../../lib/utils/RxUtils';
import {ProjectService} from '../../lib/project/project.service';
import {IMapLayer, MapLayerType} from 'abcmap-shared';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {ProjectModule} from '../../store/project/project-actions';
import LayerRemoved = ProjectModule.LayerRemoved;
import LayerAdded = ProjectModule.LayerAdded;

@Component({
  selector: 'abc-layer-selector',
  templateUrl: './layer-selector.component.html',
  styleUrls: ['./layer-selector.component.scss']
})
export class LayerSelectorComponent implements OnInit, OnDestroy {

  private layers: IMapLayer[] = [];
  private project$?: Subscription;

  constructor(private store: Store<IMainState>,
              private projectService: ProjectService) {
  }

  ngOnInit() {
    this.project$ = this.projectService.listenProjectState()
      .subscribe(project => {
        this.layers = project ? project.layers : [];
      });
  }

  ngOnDestroy() {
    RxUtils.unsubscribe(this.project$);
  }

  removeLayer($event: MouseEvent) {
    this.store.dispatch(new LayerRemoved({layerId: ''}));
  }

  addLayer($event: MouseEvent) {
    this.store.dispatch(new LayerAdded({layerType: MapLayerType.Vector }));
  }

}
