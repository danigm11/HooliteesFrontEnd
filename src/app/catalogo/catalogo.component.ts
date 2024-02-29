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
  orden:number=0;

  filtrarPorNombre(){
    this.listaMostrada=this.listaProdcutos.filter((Product) =>
    Product.name.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }
  ordenarNombre(){
    this.listaMostrada.sort((a, b) => a.name.localeCompare(b.name))
  }
  ordenarPrecio(){
    this.listaMostrada.sort((a,b)=>a.price-b.price)
  }
  ordenarNombreDesc(){
    this.listaMostrada.sort((a, b) => a.name.localeCompare(b.name))
    this.listaMostrada.reverse()
  }
  ordenarPrecioDesc(){
    this.listaMostrada.sort((a,b)=>a.price-b.price)
    this.listaMostrada.reverse()
  }
  aplicarFiltros(){
    this.listaMostrada=this.listaProdcutos;
    this.filtrarPorNombre();
  }
  ordenar(event: Event) {
    this.orden = Number((event.target as HTMLSelectElement).value);
  
    if(this.orden==0){
      this.ordenarNombre()
    }else if(this.orden==1){
      this.ordenarPrecio()
    }else if(this.orden==2){
      this.ordenarNombreDesc()
    }else{
      this.ordenarPrecioDesc()
    }
  }
}
