import { Injectable } from '@angular/core';
import { Product } from './model/Product';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ProductCarrito } from './model/ProductCarrito';
import { User } from './model/User';

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

  async getProductosCarrito(idUser: number): Promise<ProductCarrito[]>{
    try {
      const request$ = this.httpClient.get<ProductCarrito[]>(`${this.API_URL}api/CartProduct/productosCarrito/`);
      const products: ProductCarrito[] = await lastValueFrom(request$);
      
      return products;
    } catch(error) {
      alert('Mira la consola');
      console.log(error);
      return [];
    }
  }

   async post(url: string, data: any) : Promise<any> {
    const headers = {'Content-Type': `application/json`};
    let request$ =  this.httpClient.post(`${this.API_URL}${url}`, data, {headers});
    
    return await lastValueFrom(request$);
  }

  async getCantidadCarrito(id: number): Promise<number>{
    return (await this.getProductosCarrito(id)).length
  }
  
  async getUserInfo(userId: string): Promise<User | null> {
    
      const request$ = this.httpClient.get<User>(`${this.API_URL}api/User/userinfo/${userId}`);
      return await lastValueFrom(request$);
    } 
  }
