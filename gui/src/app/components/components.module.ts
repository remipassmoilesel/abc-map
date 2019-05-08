import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopBarComponent} from './top-bar/top-bar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {RightMenuComponent} from './right-menu/right-menu.component';
import {LayerSelectorComponent} from './layer-selector/layer-selector.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DrawingToolboxComponent} from './drawing-toolbox/drawing-toolbox.component';
import {DrawColorPickerComponent} from './color-picker/draw-color-picker.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {LeftMenuComponent} from './left-menu/left-menu.component';
import {NewLayerDialogComponent} from './new-layer-dialog/new-layer-dialog.component';
import { DropDataComponent } from './drop-data/drop-data.component';
import { DocumentListItemComponent } from './document-list-item/document-list-item.component';

@NgModule({
  declarations: [
    TopBarComponent,
    RightMenuComponent,
    LayerSelectorComponent,
    DrawingToolboxComponent,
    DrawColorPickerComponent,
    LeftMenuComponent,
    NewLayerDialogComponent,
    DropDataComponent,
    DocumentListItemComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
  ],
  exports: [
    TopBarComponent,
    RightMenuComponent,
    LeftMenuComponent,
    LayerSelectorComponent,
    NewLayerDialogComponent,
    DropDataComponent,
    DocumentListItemComponent
  ]
})
export class ComponentsModule {
}
