import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit{
  constructor(private httpClient: HttpClient) {

  }
  ngOnInit(): void {
    this.getProducts()
  }
  API_URL : string = 'https://localhost:7093/';
  listaProdcutos: Product[]=[];
  
  async getProducts() {
    const formData = new FormData();
    const options: any = {responseType:"text"};

    try{
      const request$ = this.httpClient.get<Product[]>(`${this.API_URL}api/Product/productdetail/`);
      const event: any = await lastValueFrom(request$);
            //console.log(event);
            
            this.listaProdcutos=event;
            console.log(this.listaProdcutos);

    }catch(error){
      alert('Está petando');
      console.log(error)
    } 
  }
}
interface Product{
  description: string;
  id:number;
  image: string;
  name: string;
  price: number;
  stock:number;
}
