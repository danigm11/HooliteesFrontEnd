import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';
import { ProductCarrito } from '../model/ProductCarrito';
import { Product } from '../model/Product';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-confirmar-compra',
  templateUrl: './confirmar-compra.component.html',
  styleUrls: ['./confirmar-compra.component.css']
})
export class ConfirmarCompraComponent implements OnInit{

  ngOnInit(): void {
   this.getCarrito()
  }
   constructor(private servicioService: ServicioService,private httpClient: HttpClient){

 }
  API_URL : string = 'https://localhost:7093/';
  productosCarrito: ProductCarrito[] = [];
  idUser = localStorage.getItem("ID") ||sessionStorage.getItem("ID") || '';
  carritoUser: Product[]=[];
  valoresSpinners:number[]=[];
  precioTotal:number=0;
  counter:number=0;

  getCarrito() {
    if (this.idUser) {
      const userId = Number.parseInt(this.idUser);
      this.servicioService.getProductosCarrito(userId).then(products => {
        products=products.filter((ProductCarrito) =>
        ProductCarrito.shoppingCartId==userId
        );
        this.productosCarrito = products;
        for (let p of this.productosCarrito){
          this.getProducto(p.productId);
        }
        console.log(this.productosCarrito)
      });
    } else {
      alert("Inicia sesión primero");
    }
  }
  getProducto(id:number){
    this.servicioService.getProducts().then(products => {
      products=products.filter((Product) =>
      Product.id==id
      );
      this.carritoUser.push(products[0]);
      this.precioTotal+=(products[0].price*this.productosCarrito[this.counter].quantity);
      this.counter++;
    });
  }

  async buyProducts () {
    const account = await this.getAccount();
    let transaction = await this.servicioService.post(`buy/${this.productosCarrito}`, JSON.stringify(account)) as Transaction;

    console.log(transaction);
    
    const txHash = await this.makeTransaction(transaction);
    const transactionSuccess = await this.servicioService.post(`check/${transaction.id}`, JSON.stringify(txHash));

    console.log('Transacción realizada: ' + transactionSuccess)

    const transactionMessage = transactionSuccess
      ? 'Transacción realizada con éxito :D'
      :'Transacción fallida :(';

    console.log(transactionMessage)

    /*this.dialog!.querySelector('p')!.innerText = transactionMessage;
    this.dialog!.showModal();*/
  }

  private async getAccount() : Promise<string> {
    if (typeof window.ethereum == 'undefined') {
      throw new Error('MetaMask no está instalado');
    }

    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    const account = accounts[0];

    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [
        {
          "eth_accounts": { account }
        }
      ]
    });

    return account;
  }

  private async makeTransaction(transaction: Transaction) : Promise<string> {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: transaction.from,
          to: transaction.to,
          value: transaction.value,
          gas: transaction.gas,
          gasPrice: transaction.gasPrice
        }
      ]
    });

    return txHash;
  }

}
interface Transaction {
  id: number,
  from: string,
  to: string,
  value: string,
  gas: string,
  gasPrice: string
}

declare global {
  interface Window {
    ethereum: any;
  }
}