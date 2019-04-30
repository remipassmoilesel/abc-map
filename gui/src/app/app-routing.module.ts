import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainMapComponent} from './views/main-map/main-map.component';
import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {LoginComponent} from './views/login/login.component';
import {RegisterComponent} from './views/register/register.component';

export declare type AbcRoute = string;

export namespace AbcRoutes {
  export const MAP: AbcRoute = 'map';
  export const REGISTER: AbcRoute = 'register';
  export const LOGIN: AbcRoute = 'login';
}

const routes: Routes = [
  {
    path: AbcRoutes.MAP,
    component: MainMapComponent
  },
  {
    path: AbcRoutes.LOGIN,
    component: LoginComponent
  },
  {
    path: AbcRoutes.REGISTER,
    component: RegisterComponent
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
