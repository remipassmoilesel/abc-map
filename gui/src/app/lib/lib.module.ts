import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {ProjectService} from "./project/project.service";

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    CommonModule
  ],
  providers: [
    ProjectService
  ]
})
export class LibModule {
}
