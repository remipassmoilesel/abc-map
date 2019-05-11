import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectService} from '../../lib/project/project.service';
import {RxUtils} from '../../lib/utils/RxUtils';
import {Subscription} from 'rxjs';
import {GuiRoutes} from '../../app-routing.module';
import {AuthenticationService} from '../../lib/authentication/authentication.service';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';
import {RoutingService} from '../../lib/routing/routing.service';

@Component({
  selector: 'abc-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {

  project$?: Subscription;
  routes = GuiRoutes;
  projectName = '';
  loggedIn = false;

  constructor(private project: ProjectService,
              private routing: RoutingService,
              private store: Store<IMainState>,
              private authentication: AuthenticationService) {
  }

  ngOnInit() {
    this.project$ = this.project.listenProjectState()
      .subscribe(project => this.projectName = project ? project.name : '');
    this.store.select(state => state.user.loggedIn)
      .subscribe(loggedId => this.loggedIn = loggedId);
  }

  ngOnDestroy() {
    RxUtils.unsubscribe(this.project$);
  }

  newProject() {
    this.project.createNewProject()
      .subscribe(res => this.routing.navigate(GuiRoutes.MAP));
  }

  closeProject() {
    throw new Error('Implement me');
  }

  saveProject() {
    this.project.saveProject().subscribe();
  }

  logout() {
    this.authentication.logout();
  }
}
