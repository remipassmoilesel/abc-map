import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ComponentsModule} from '../components/components.module';
import {MainMapComponent} from './main-map/main-map.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {RouterModule} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ComponentsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [
    MainMapComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent
  ],
})
export class ViewsModule {
}
