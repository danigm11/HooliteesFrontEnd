import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { User } from '../model/User';
import { ProductPedido } from '../model/ProductPedido';
import { Transaction } from '../model/Transaction';
import { Product } from '../model/Product';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit{

  constructor(private router: Router, private servicio: ServicioService, private httpClient: HttpClient){}

  ngOnInit(): void {

    if(this.idUser==''){
      alert('Inicia sesión primero')
      this.router.navigate(['/']);
    }else{
      this.getTransactions()
      this.getUser()
    }
  }
  idUser = localStorage.getItem("ID") ||sessionStorage.getItem("ID") || '';
  user: any;
  API_URL : string = 'https://localhost:7093/';
  listaPedidos: ProductPedido[]=[];
  listaTransactionId: string[]=[];
  listaProductospedidos:Product[]=[];
  productoActual: any;

  async getUser(){
    try{
      const request$ = this.httpClient.get<User[]>(`${this.API_URL}api/User/userlist/`);
      let lista=await lastValueFrom(request$);

      lista=lista.filter((user) =>
      user.id.toString()==this.idUser
      );
      this.user=lista[0]
    }catch(e:any){

    }
  }

  async getTransactions(){
    const request$ = this.httpClient.get<Transaction[]>(`${this.API_URL}api/Transaction/transactions/`);
    let listaTransactions=await lastValueFrom(request$);

    listaTransactions=listaTransactions.filter((Transaction) =>
    Transaction.userId.toString()==this.idUser
       );
    for(let t of listaTransactions){
      this.listaTransactionId.push(t.id.toString())
    }
    this.getPedidos()
  }

  async getPedidos(){
    const request$ = this.httpClient.get<ProductPedido[]>(`${this.API_URL}api/Transaction/productosHistorial/`);
    this.listaPedidos=await lastValueFrom(request$);

    this.listaPedidos = this.listaPedidos.filter((Product) =>
      this.listaTransactionId.includes(Product.ordersId.toString())
    );
    console.log(this.listaPedidos)
    for(let p of this.listaPedidos){
      this.getProducto(p.productsId)
    }
    console.log(this.listaProductospedidos)
  }

  async getProducto(id: number){
    this.servicio.getProducts().then(products => {
      console.log(id)
      products=products.filter((Product) =>
      Product.id==id
      );
      console.log(products[0])
      this.listaProductospedidos.push(products[0]);
    });
  }

}
