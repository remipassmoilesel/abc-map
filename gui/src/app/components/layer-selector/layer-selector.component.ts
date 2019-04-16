import {Component, OnDestroy, OnInit} from '@angular/core';
import {RxUtils} from '../../lib/utils/RxUtils';
import {ProjectService} from '../../lib/project/project.service';
import {IMapLayer, IProject, MapLayerType} from 'abcmap-shared';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {ProjectModule} from '../../store/project/project-actions';
import {ToastService} from '../../lib/notifications/toast.service';
import {take} from 'rxjs/operators';
import LayerRemoved = ProjectModule.LayerRemoved;
import LayerAdded = ProjectModule.LayerAdded;
import ActiveLayerChanged = ProjectModule.ActiveLayerChanged;

@Component({
  selector: 'abc-layer-selector',
  templateUrl: './layer-selector.component.html',
  styleUrls: ['./layer-selector.component.scss']
})
export class LayerSelectorComponent implements OnInit, OnDestroy {

  private layers: IMapLayer[] = [];
  private activeLayerId?: string;

  private project$?: Subscription;

  constructor(private store: Store<IMainState>,
              private toasts: ToastService,
              private projectService: ProjectService) {
  }

  ngOnInit() {
    this.listenProjectChanges();
  }

  ngOnDestroy() {
    RxUtils.unsubscribe(this.project$);
  }

  onActiveLayerChanged($event: any) {
    const newActiveLayerId: string = $event.target.value;
    this.store.dispatch(new ActiveLayerChanged({layerId: newActiveLayerId}));
  }

  removeLayer($event: MouseEvent) {
    if (!this.activeLayerId) {
      throw new Error('Active layer not set');
    }
    const activeLayerId = this.activeLayerId;
    this.projectService.listenProjectState()
      .pipe(take(1))
      .subscribe(project => {
        if (!project) {
          this.toasts.errorForNonExisitingProject();
          return;
        }
        this.store.dispatch(new LayerRemoved({layerId: activeLayerId}));
      });
  }

  addLayer($event: MouseEvent) {
    this.store.dispatch(new LayerAdded({layerType: MapLayerType.Vector}));
  }

  listenProjectChanges() {
    this.project$ = this.projectService.listenProjectState()
      .subscribe(project => {
        if (project) {
          this.setProjectLayers(project);
        } else {
          this.setEmptyLayers();
        }
      });
  }

  setProjectLayers(project: IProject) {
    this.layers = project.layers;
    this.activeLayerId = project.activeLayerId;
  }

  setEmptyLayers() {
    this.layers = [];
    this.activeLayerId = '';
  }

}
