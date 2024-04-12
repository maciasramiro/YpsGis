import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirecciona la ruta raíz a /login
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'mapa', component: MapaComponent },
  { path: 'home', component: HomeComponent },
  //{ path: 'parametros', component: ParametrosComponent },
  { path: '**', redirectTo: '/home' }, // Redirecciona todas las rutas no definidas a /login

  // { path: 'map', component: MapComponent }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
