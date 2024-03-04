import { Component, OnInit } from '@angular/core';
import { Product } from '../model/Product';
import { HttpClient } from '@angular/common/http';
import { Subscription, lastValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit{

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private servicioService: ServicioService,
    private formBuilder: FormBuilder
    ) {
      this.myForm = this.formBuilder.group({
        cantidad: ['1',]
      });
  }
  unsubs: Subscription | null = null;

  ngOnInit(): void {
    this.unsubs = this.activatedRoute.params.subscribe((data) => {
      this.id = data['id'];
      this.getProducto();
    })
  }

  API_URL : string = 'https://localhost:7093/';
  productoDetalle: any;
  id: number=0;
  myForm: FormGroup;
  idUser = localStorage.getItem("ID") ||sessionStorage.getItem("ID") || '';

  getProducto(){
    this.servicioService.getProducts().then(products => {
      products=products.filter((Product) =>
      Product.id==this.id
      );
      this.productoDetalle=products[0];
    });
  }
  async addCarrito(){
    if (this.idUser == '') {
          try {
            localStorage.setItem('productId' + this.id.toString(), this.id.toString());
            localStorage.setItem('quantity' + this.id.toString(), this.myForm.get('cantidad')?.value);
            alert("Producto añadido al carrito")
        }  catch (error) {
            console.log(error)
          }
    } else {
    const formData = new FormData();
    const options: any = {responseType:"text"};
    formData.append('productId', this.id.toString());
    formData.append('userId', this.idUser);
    formData.append('quantity', this.myForm.get('cantidad')?.value);
    try {
      const request$ = this.httpClient.post<string>(`${this.API_URL}api/ShoppingCart/addtoshopcart/`, formData);
      var event: any = await lastValueFrom(request$);
      alert("Producto añadido al carrito")
      window.location.reload();
    } catch (error) {
      console.log(event)
    }
  }
  }
}