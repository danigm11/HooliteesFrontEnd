import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  API_URL : string = 'https://localhost:7093/';

  myForm: FormGroup;
  email: string = '';
  password: string='';

  users: User[] = [];

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) {
    this.myForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }

  async uploadRegister() {
    const formData = new FormData();
    formData.append('nombre', this.myForm.get('nombre')?.value);
    formData.append('email', this.myForm.get('email')?.value);
    formData.append('password', this.myForm.get('password')?.value);
    formData.append('direccion', this.myForm.get('direccion')?.value);
  
    const request$ = this.httpClient.post<boolean>(`${this.API_URL}api/registro/`, formData);
    await lastValueFrom(request$);
  
    alert('Registro exitoso.');
    
  }
  
  async updateImageList() {
    const request$ = this.httpClient.get<User[]>(`${this.API_URL}api/userlist/`);
    this.users = await lastValueFrom(request$);
  }
}
interface User {
  email: string;
  password: string;
}


