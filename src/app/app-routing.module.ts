import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [

  {path: 'home', component: InicioComponent},
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
