import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../servicio.service';
import { ProductCarrito } from '../model/ProductCarrito';
import { Product } from '../model/Product';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirmar-compra',
  templateUrl: './confirmar-compra.component.html',
  styleUrls: ['./confirmar-compra.component.css']
})
export class ConfirmarCompraComponent implements OnInit{

  ngOnInit(): void {
   this.getCarrito()
  }
   constructor(private servicioService: ServicioService,private formBuilder: FormBuilder,private httpClient: HttpClient){
    this.myForm = this.formBuilder.group({
      clientWallet: ['', Validators.required],
      userId: ['', Validators.required],
      totalPrice: ['',Validators.required]
    });

 }
  API_URL : string = 'https://localhost:7093/';
  myForm: FormGroup;
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
          this.getProductoLocal(p.productId);
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
  getProductoLocal(id: number) {
    const key = 'productId' + id.toString();
    const listaProducto = localStorage.getItem(key);
    const cantidadLocal = localStorage.getItem('quantity' + id.toString());
    if (listaProducto && cantidadLocal) {
      this.servicioService.getProducts().then(products => {
        const product = products.find(product => product.id == id);
        if (product) {
          const cantidad = parseInt(cantidadLocal, 10);
          this.carritoUser.push(product);
          this.precioTotal += product.price * cantidad;
        }
      });
    } else {
      console.log('No se encontró ningún producto con la ID:', id);
    }
  }
  async buyProducts() {
    const account = await this.getAccount();
    var accString = JSON.stringify(account);
    accString = accString.replace(/['"]/g, '');
    console.log(accString)
    const formData = new FormData();
    formData.append('clientWallet', accString);
    formData.append('totalPrice', this.precioTotal.toString());
    formData.append('userId', this.idUser);

    //let transaction = await this.servicioService.post(`buyProducts`, JSON.stringify(account)) as Transaction;
    //const request$ = this.httpClient.post<string>(`${this.API_URL}api/User/login/`, formData,options);

    //let transaction = await this.servicioService.post(`api/ConfirmOrder/buyProducts`, formData) as Transaction;
    let request$ = await this.httpClient.post<Transaction>(`${this.API_URL}api/ConfirmOrder/buyProducts`, formData);
    var transaction: any = await lastValueFrom(request$);
    console.log(transaction);
    
    const txHash = await this.makeTransaction(transaction);
    const transactionSuccess = await this.servicioService.post(`check/${transaction.id}`, JSON.stringify(txHash));

    console.log('Transacción realizada: ' + transactionSuccess)

    const transactionMessage = transactionSuccess
      ? 'Transacción realizada con éxito :D'
      :'Transacción fallida :(';

    console.log(transactionMessage)
    console.log("Hola")

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