import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainMapComponent} from './views/main-map/main-map.component';
import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {LoginComponent} from './views/login/login.component';
import {RegisterComponent} from './views/register/register.component';
import {DataStoreComponent} from './views/datastore/data-store.component';

export declare type GuiRoute = string;

export namespace GuiRoutes {
  export const MAP: GuiRoute = 'map';
  export const REGISTER: GuiRoute = 'register';
  export const LOGIN: GuiRoute = 'login';
  export const STORE: GuiRoute = 'datastore';
}

const routes: Routes = [
  {
    path: GuiRoutes.MAP,
    component: MainMapComponent
  },
  {
    path: GuiRoutes.LOGIN,
    component: LoginComponent
  },
  {
    path: GuiRoutes.REGISTER,
    component: RegisterComponent
  },
  {
    path: GuiRoutes.STORE,
    component: DataStoreComponent
  },
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full'
  },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
