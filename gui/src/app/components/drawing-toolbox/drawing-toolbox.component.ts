import {Component, OnInit} from '@angular/core';
import {DrawingTool, DrawingTools} from '../../lib/map/DrawingTool';
import {MapService} from '../../lib/map/map.service';
import {ProjectService} from '../../lib/project/project.service';
import {take} from 'rxjs/operators';
import {ToastService} from '../../lib/notifications/toast.service';
import {IMapLayer, IProject, MapLayerType} from 'abcmap-shared';
import * as _ from 'lodash';

@Component({
  selector: 'abc-drawing-toolbox',
  templateUrl: './drawing-toolbox.component.html',
  styleUrls: ['./drawing-toolbox.component.scss']
})
export class DrawingToolboxComponent implements OnInit {

  tools = DrawingTools.All;

  constructor(private mapService: MapService,
              private toasts: ToastService,
              private projectService: ProjectService) {
  }

  ngOnInit() {
  }

  setTool(drawingTool: DrawingTool) {
    this.projectService.listenProjectState()
      .pipe(take(1))
      .subscribe((project: IProject | undefined) => {
        if (!project) {
          this.toasts.errorForNonExistingProject();
          return;
        }

        const layer: IMapLayer | undefined = _.find(project.layers, lay => lay.id === project.activeLayerId);
        if (!layer || layer.type !== MapLayerType.Vector) {
          this.toasts.error('La couche active doit être une couche de dessin');
          return;
        }

        this.mapService.setDrawingTool(drawingTool);
      });
  }
}
