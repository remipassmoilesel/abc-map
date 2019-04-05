import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LibModule} from "./lib/lib.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    LibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
