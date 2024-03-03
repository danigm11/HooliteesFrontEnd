import { Component, OnInit } from '@angular/core';
import { ProductCarrito } from '../model/ProductCarrito';
import { ServicioService } from '../servicio.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from '../model/Product';
import { FormBuilder, FormGroup } from '@angular/forms';
import { delay, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit{
  constructor(private httpClient: HttpClient,private servicioService: ServicioService,private formBuilder: FormBuilder,private router: Router) {
    this.myForm = this.formBuilder.group({
        cantidad: []
      });}
    ngOnInit(): void {
      this.getCarrito();
    }
    myForm: FormGroup;
    
    API_URL : string = 'https://localhost:7093/';
    productosCarrito: ProductCarrito[] = [];
    idUser = localStorage.getItem("ID") ||sessionStorage.getItem("ID") || '';
    carritoUser: Product[]=[];
    valoresSpinners:number[]=[];
    precioTotal:number=0;
    counter:number=0;
    valorSpinner:number=0;
    
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
            console.log(p.productId);
            this.getProductoLocal(p.productId);
            console.log()
          }
          for(this.counter = 1; this.counter <= 11;this.counter++){
            this.getProductoLocal(this.counter);
          }
          console.log(this.productosCarrito)
        });
      } else {
        for(this.counter = 1; this.counter <= 11;this.counter++){
          this.getProductoLocal(this.counter);
        }
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
        this.valoresSpinners.push(this.productosCarrito[this.counter].quantity);
        this.counter++;
      });
    }
    async eliminarProducto(idProducto:number){
      
      const formData = new FormData();
      const key = 'productId' + idProducto.toString();
      formData.append('productId', idProducto.toString());
      formData.append('userId', this.idUser);
      localStorage.removeItem(key);
      localStorage.removeItem('quantity' + idProducto.toString());
      try {
        const request$ = this.httpClient.put<string>(`${this.API_URL}api/CartProduct/eliminarproductocarrito/`, formData);
        window.location.reload();
        await lastValueFrom(request$);
      } catch (error) {
        console.log(error);
      }
    }

    async actualizarCantidad(idProducto:number,cantidad:number){
      const formData = new FormData();
      formData.append('productId', idProducto.toString());
      formData.append('userId', this.idUser);
      formData.append('quantity', cantidad.toString());
      localStorage.setItem('quantity' + idProducto.toString(), cantidad.toString())
      try {
        const request$ = this.httpClient.put<string>(`${this.API_URL}api/CartProduct/cambiarcantidad/`, formData);
        this.reloadWindowAfterDelay();
        await lastValueFrom(request$);

      } catch (error) {
        console.log(error);
      }
    }

    getProductoLocal(id: number) {
      const key = 'productId' + id.toString();
      const listaProducto = localStorage.getItem(key);
      const cantidadLocal = localStorage.getItem('quantity' + id.toString());
    
      if (listaProducto && cantidadLocal) {
        this.servicioService.getProducts().then(products => {
          const product = products.find(product => product.id === id);
          if (product) {
            const cantidad = parseInt(cantidadLocal, 10);
            this.carritoUser.push(product);
            this.precioTotal += product.price * cantidad;
            this.valoresSpinners.push(cantidad);
          }
        });
      } else {
        //console.log('No se encontró ningún producto con la ID:', id);
      }
    }

    async eliminarProductoLocal(idProducto:number){
      const formData = new FormData();
      const key = 'productId' + idProducto.toString();
      formData.append('productId' + idProducto.toString(), idProducto.toString());
      formData.append('userId', this.idUser);
      try {
        const request$ = this.httpClient.put<string>(`${this.API_URL}api/CartProduct/eliminarproductocarrito/`, formData);
        window.location.reload();
        await lastValueFrom(request$);
      } catch (error) {
        console.log(error);
      }
    }
    async actualizarCantidadLocal(idProducto:number,cantidad:number){
      const formData = new FormData();
      formData.append('productId' + idProducto.toString(), idProducto.toString());
      formData.append('userId', this.idUser);
      formData.append('quantity' + idProducto.toString(), cantidad.toString());
      try {
        const request$ = this.httpClient.put<string>(`${this.API_URL}api/CartProduct/cambiarcantidad/`, formData);
        this.reloadWindowAfterDelay();
        await lastValueFrom(request$);
      } catch (error) {
        console.log(error);
      }
    }
    reloadWindowAfterDelay() {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
}
