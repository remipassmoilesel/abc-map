import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainMapComponent} from '../views/main-map/main-map.component';
import {PageNotFoundComponent} from '../views/page-not-found/page-not-found.component';

export const MAP = 'map';

const routes: Routes = [
  {
    path: 'map',
    component: MainMapComponent
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
