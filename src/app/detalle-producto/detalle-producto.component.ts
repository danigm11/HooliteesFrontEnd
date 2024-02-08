import { Component, OnInit } from '@angular/core';
import { Product } from '../model/Product';
import { HttpClient } from '@angular/common/http';
import { Subscription, lastValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ServicioService } from '../servicio.service';
@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit{

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private servicioService: ServicioService
    ) {

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

  getProducto(){
    this.servicioService.getProducts().then(products => {
      products=products.filter((Product) =>
      Product.id==this.id
      );
      this.productoDetalle=products[0];
    });
  }
}
