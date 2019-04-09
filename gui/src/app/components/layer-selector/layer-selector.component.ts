import {Component, OnDestroy, OnInit} from '@angular/core';
import {RxUtils} from "../../lib/utils/RxUtils";
import {ProjectService} from "../../lib/project/project.service";
import {IMapLayer} from 'abcmap-shared';
import {Subscription} from "rxjs";

@Component({
  selector: 'abc-layer-selector',
  templateUrl: './layer-selector.component.html',
  styleUrls: ['./layer-selector.component.scss']
})
export class LayerSelectorComponent implements OnInit, OnDestroy {

  private layers: IMapLayer[] = [];
  private project$?: Subscription;

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {
    this.project$ = this.projectService.listenProjectState()
      .subscribe(project => {
        this.layers = project ? project.layers : [];
      })
  }

  ngOnDestroy() {
    RxUtils.unsubscribe(this.project$)
  }

}
