import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {
  httpClient: any;
  API_URL: string = 'https://localhost:7093/';
  constructor(
        
    private route: ActivatedRoute

    ){}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];

    if(id == this.getDetallesProductos.id){
    this.getDetallesProductos();
    }

    throw new Error('Method not implemented.');
  }

  listaDetalles:Producto[]=[];

  async getDetallesProductos(){
    try{
      const request$ = this.httpClient.get<Producto[]>(`${this.API_URL}api/Product/productdetail/`);
      const event: any = await lastValueFrom(request$);
            //console.log(event);
            
            this.listaDetalles=event;
            console.log(this.listaDetalles);

    }catch(error){
      alert('Está petando');
      console.log(error)
    }
  }

}
interface Producto{
  name:string;
  id:number;
  image:string;
  description:string;
  price:string;
  stock:number;
}
