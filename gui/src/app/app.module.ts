import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LibModule} from "./lib/lib.module";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { ProjectEffects } from './store/effects/project-effects.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    LibModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([ProjectEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
