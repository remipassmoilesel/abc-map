import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopBarComponent} from './top-bar/top-bar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {RightMenuComponent} from './right-menu/right-menu.component';
import { LayerSelectorComponent } from './layer-selector/layer-selector.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [TopBarComponent, RightMenuComponent, LayerSelectorComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    TopBarComponent,
    RightMenuComponent,
    LayerSelectorComponent
  ]
})
export class ComponentsModule {
}
