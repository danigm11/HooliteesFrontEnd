import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  constructor(private servicio: ServicioService){
    
  }

  ngOnInit(): void {
    this.getCantidad()
    this.getLogin()
  }
  cantidadEnCarrito: number=0;
  carritoLleno: boolean=false;
  isLoggedIn: boolean= false;

  getCantidad(){
    this.servicio.getCantidadCarrito(1).then(cantidad => {
    this.cantidadEnCarrito=cantidad;
    this.carritoLleno=this.cantidadEnCarrito>0;

  });
  }
  getLogin(){
    let idUser = localStorage.getItem("ID") ||sessionStorage.getItem("ID") || '';

    if(idUser!=''){
      this.isLoggedIn=true;
    }
    
  }
}
