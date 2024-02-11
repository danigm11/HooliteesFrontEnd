import { Component, OnInit } from '@angular/core';
import { ProductCarrito } from '../model/ProductCarrito';
import { ServicioService } from '../servicio.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from '../model/Product';

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

    API_URL : string = 'https://localhost:7093/';
    productosCarrito: ProductCarrito[] = [];
    carritoUser: Product[]=[];
    precioTotal:number=0;
    counter:number=0;
    
    getCarrito() {
      const userIdString = localStorage.getItem("ID");
      if (userIdString) {
        const userId = Number.parseInt(userIdString);
        this.servicioService.getProductosCarrito(userId).then(products => {
          products=products.filter((ProductCarrito) =>
          ProductCarrito.shoppingCartId==userId
          );
          this.productosCarrito = products;
          for (let p of this.productosCarrito){
            //console.log(p.productId);
            this.getProducto(p.productId);
            console.log()
          }
          console.log(this.productosCarrito)
        });
      } else {
        alert("Inicia sesión primero");
      }
    }
    getProducto(id:number){
      this.servicioService.getProducts().then(products => {
        products=products.filter((Product) =>
        Product.id==id
        );
        this.carritoUser.push(products[0]);
        this.precioTotal+=(products[0].price*this.productosCarrito[this.counter].quantity);
        this.counter++;
      });
    }
    
  
}
