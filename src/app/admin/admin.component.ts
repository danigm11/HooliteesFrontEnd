import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { User } from '../model/User';
import { Product } from '../model/Product';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  idUser = localStorage.getItem("ID") || sessionStorage.getItem("ID") || '';
  user: User | undefined;
  usersList: User[] = [];
  productsList: Product[] = [];
  API_URL: string = 'https://localhost:7093/';
  myForm: FormGroup;
  showProductForm: boolean = false;
  selectedProductId: number | null = null;
  selectedFile: File | undefined;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      file: ['']
    });
  }

  ngOnInit(): void {
    this.getUsersList();
    this.getProductList();
  }

  toggleProductForm(): void {
    this.showProductForm = !this.showProductForm;
  }

  createProduct(): void {
    if (!this.myForm.valid) {
      console.error('Formulario no válido. Asegúrate de completar todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.myForm.get('name')?.value);
    formData.append('Description', this.myForm.get('description')?.value);
    formData.append('Price', this.myForm.get('price')?.value);
    formData.append('Stock', this.myForm.get('stock')?.value);
    formData.append('File', this.selectedFile!);

    this.httpClient.post(`${this.API_URL}api/Product/createProduct`, formData)
      .subscribe(
        (response: any) => {
          console.log('Producto creado con éxito:', response);
          this.getProductList();
          this.myForm.reset();
        },
        (error) => {
          console.error('Error al crear el producto:', error);
        }
      );
  }

  saveCreatedProduct(): void {
    if (this.selectedProductId !== null && this.myForm.valid) {
      const formData = new FormData();
      formData.append('Name', this.myForm.get('name')?.value);
      formData.append('Description', this.myForm.get('description')?.value);
      formData.append('Price', this.myForm.get('price')?.value);
      formData.append('Stock', this.myForm.get('stock')?.value);

      this.httpClient.put(`${this.API_URL}api/Product/modifyProduct/${this.selectedProductId}`, formData)
        .subscribe(
          (response: any) => {
            console.log('Producto modificado con éxito:', response);
            this.getProductList();
            this.myForm.reset();
            this.selectedProductId = null;
          }
        );
    }
  }

  getUsersList() {
    this.httpClient.get<User[]>(`${this.API_URL}api/User/userlist/`)
      .subscribe(
        (data: User[]) => {
          this.usersList = data;
        },
        (error) => {
          console.error('Error al obtener la lista de usuarios:', error);
        }
      );
  }

  getProductList() {
    this.httpClient.get<Product[]>(`${this.API_URL}api/Product/productdetail/`)
      .subscribe(
        (data: Product[]) => {
          this.productsList = data;
        },
        (error) => {
          console.error('Error al obtener la lista de productos:', error);
        }
      );
  }

  deleteUser(userId: number): void {
    this.httpClient.delete(`${this.API_URL}api/User/deleteUser/${userId}`)
      .subscribe(
        (response: any) => {
          console.log('Usuario eliminado con éxito:', response);
          this.getUsersList();
        },
        (error) => {
          console.error('Error al eliminar el usuario:', error);
        }
      );
  }

  editProduct(productId: number): void {
    this.selectedProductId = productId;
    const selectedProduct = this.productsList.find(product => product.id === productId);

    if (selectedProduct) {
      this.myForm.patchValue({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
      });
    }
  }

  saveEditedProduct(): void {
    if (this.selectedProductId !== null && this.myForm.valid) {
      const formData = new FormData();
      formData.append('Name', this.myForm.get('name')?.value);
      formData.append('Description', this.myForm.get('description')?.value);
      formData.append('Price', this.myForm.get('price')?.value);
      formData.append('Stock', this.myForm.get('stock')?.value);

      this.httpClient.put(`${this.API_URL}api/Product/modifyProduct/${this.selectedProductId}`, formData)
        .subscribe(
          (response: any) => {
            console.log('Producto modificado con éxito:', response);
            this.getProductList();
            this.myForm.reset();
            this.selectedProductId = null;
          },
          (error) => {
            console.error('Error al modificar el producto:', error);
          }
        );
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }
}
