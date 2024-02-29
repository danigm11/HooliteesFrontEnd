import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { User } from '../model/User';
import { ProductPedido } from '../model/ProductPedido';
import { Transaction } from '../model/Transaction';
import { Product } from '../model/Product';
import { Pedido } from '../model/Pedido';

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

  listaPedidosconTodo: Pedido[]=[];

  listaProductosOrdenados: Product[][]=[];

  counter: number =0;

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
    this.getPedidos()

    for(let t of listaTransactions){
      let transaction = t;
      let products = this.listaPedidos.filter((Product) =>
      Product.ordersId==t.id
    );
      let pedidoConTodo : Pedido = { transaction, products }
      this.listaPedidosconTodo.push(pedidoConTodo)
      this.listaTransactionId.push(t.id.toString())
    }
  }

  async getPedidos(){
    const request$ = this.httpClient.get<ProductPedido[]>(`${this.API_URL}api/Transaction/productosHistorial/`);
    this.listaPedidos=await lastValueFrom(request$);

    this.listaPedidos = this.listaPedidos.filter((Product) =>
      this.listaTransactionId.includes(Product.ordersId.toString())
    );
    let idTransaccion: number =this.listaPedidos[0].ordersId;
    for(let p of this.listaPedidos){
      if(idTransaccion!=p.ordersId){

        this.getProductos(this.listaPedidosconTodo[this.counter].products)
        idTransaccion=p.ordersId
        this.counter++
      }
      this.listaPedidosconTodo[this.counter].products.push(p)
    }

  }

   async getProductos(listaPedidos: ProductPedido[]){

    let lista: Product[]=[];
    for(let p of listaPedidos){

      this.servicio.getProducts().then(products => {
        products=products.filter((Product) =>
        Product.id==p.productsId
        );
        lista.push(products[0]);
      });
    }
    this.listaProductosOrdenados.push(lista)
  }

}
