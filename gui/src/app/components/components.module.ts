import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopBarComponent} from './top-bar/top-bar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {RightMenuComponent} from './right-menu/right-menu.component';
import {LayerSelectorComponent} from './layer-selector/layer-selector.component';
import {FormsModule} from "@angular/forms";
import {DrawingToolboxComponent} from './drawing-toolbox/drawing-toolbox.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import {ColorPickerModule} from 'ngx-color-picker';

@NgModule({
  declarations: [TopBarComponent, RightMenuComponent, LayerSelectorComponent, DrawingToolboxComponent, ColorPickerComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule,
    ColorPickerModule,
  ],
  exports: [
    TopBarComponent,
    RightMenuComponent,
    LayerSelectorComponent
  ]
})
export class ComponentsModule {
}
