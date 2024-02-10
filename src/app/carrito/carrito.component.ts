import { Component, OnInit } from '@angular/core';
import { ProductCarrito } from '../model/ProductCarrito';
import { ServicioService } from '../servicio.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit{
  constructor(private httpClient: HttpClient,private servicioService: ServicioService,private router: Router) {
    }
    ngOnInit(): void {
      this.getCarrito();
    }
    
    productosCarrito: ProductCarrito[] = [];
    
    getCarrito() {
      const userIdString = localStorage.getItem("ID");
      
      if (userIdString) {
        const userId = Number.parseInt(userIdString);
        this.servicioService.getProductosCarrito(userId).then(products => {
          this.productosCarrito = products;
        });
      } else {
        alert("Inicia sesión primero");
      }
    }
    
  
}
