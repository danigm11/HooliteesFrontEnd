import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';
import { ProductCarrito } from '../model/ProductCarrito';
import { Product } from '../model/Product';

@Component({
  selector: 'app-confirmar-compra',
  templateUrl: './confirmar-compra.component.html',
  styleUrls: ['./confirmar-compra.component.css']
})
export class ConfirmarCompraComponent implements OnInit{
 constructor(private servicioService: ServicioService){

 }
  ngOnInit(): void {
   this.getCarrito()
  }
  API_URL : string = 'https://localhost:7093/';
  productosCarrito: ProductCarrito[] = [];
  idUser = localStorage.getItem("ID") ||sessionStorage.getItem("ID") || '';
  carritoUser: Product[]=[];
  valoresSpinners:number[]=[];
  precioTotal:number=0;
  counter:number=0;

  getCarrito() {
    var userIdString = localStorage.getItem("ID");
    if(!userIdString){
      userIdString = sessionStorage.getItem("ID");
    }
    if (userIdString) {
      const userId = Number.parseInt(userIdString);
      this.servicioService.getProductosCarrito(userId).then(products => {
        products=products.filter((ProductCarrito) =>
        ProductCarrito.shoppingCartId==userId
        );
        this.productosCarrito = products;
        for (let p of this.productosCarrito){
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
