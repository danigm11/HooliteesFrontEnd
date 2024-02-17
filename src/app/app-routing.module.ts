import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { CarritoComponent } from './carrito/carrito.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';
import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';
import { ConfirmarCompraComponent } from './confirmar-compra/confirmar-compra.component';

const routes: Routes = [

  {path: 'home', component: InicioComponent},
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {path: 'carrito', component: CarritoComponent},
  {path: 'catalogo', component: CatalogoComponent},
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'detalle/:id', component: DetalleProductoComponent },
  { path: 'confirmar', component: ConfirmarCompraComponent },
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
