import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopBarComponent} from './top-bar/top-bar.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [TopBarComponent],
  exports: [
    TopBarComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
  ]
})
export class ComponentsModule {
}
