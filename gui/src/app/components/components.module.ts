import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopBarComponent} from './top-bar/top-bar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {RightMenuComponent} from './right-menu/right-menu.component';

@NgModule({
  declarations: [TopBarComponent, RightMenuComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  exports: [
    TopBarComponent,
    RightMenuComponent
  ]
})
export class ComponentsModule {
}
