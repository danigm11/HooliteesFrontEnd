import { Injectable } from '@angular/core';
import { Product } from './model/Product';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private httpClient:HttpClient) { }

  API_URL : string = 'https://localhost:7093/';
  
  async getProducts(): Promise<Product[]> {
    try {
      const request$ = this.httpClient.get<Product[]>(`${this.API_URL}api/Product/productdetail/`);
      const products: Product[] = await lastValueFrom(request$);
      
      return products;
    } catch(error) {
      alert('Seguramente te hayas olvidado de ejecutar la base de datos');
      console.log(error);
      return [];
    }
  }
}
