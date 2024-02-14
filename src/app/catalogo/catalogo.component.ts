import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Product } from '../model/Product';
import { ServicioService } from '../servicio.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit{
  constructor(private httpClient: HttpClient, private servicioService: ServicioService) {

  }
  ngOnInit(): void {
    this.servicioService.getProducts().then(products => {
      this.listaMostrada = products;
      this.listaProdcutos=this.listaMostrada;
      this.ordenarNombre()
    });
  }

  API_URL : string = 'https://localhost:7093/';
  listaProdcutos: Product[]=[];
  listaMostrada: Product[]=[];
  filtroNombre: string = '';
  orden:boolean=false;

  filtrarPorNombre(){
    this.listaMostrada=this.listaProdcutos.filter((Product) =>
    Product.name.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }
  ordenarNombre(){
    this.listaMostrada.sort((a, b) => a.name.localeCompare(b.name));
  }
  ordenarPrecio(){
    this.listaMostrada.sort((a,b)=>a.price-b.price)
  }
  aplicarFiltros(){
    this.listaMostrada=this.listaProdcutos;
    this.filtrarPorNombre();
  }
  ordenar(){
    if(this.orden){
      this.ordenarNombre()
    }else{
      this.ordenarPrecio()
    }
  }
}
