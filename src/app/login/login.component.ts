import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  API_URL : string = 'https://localhost:7093/';

  myForm: FormGroup;
  email: string = '';
  password: string='';

  users: User[] = [];

  constructor(private httpClient: HttpClient,private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

 async uploadCredentials() {
    const formData = new FormData();
    formData.append('email', this.myForm.get('email')?.value);
    formData.append('password', this.myForm.get('password')?.value);

    const request$ = this.httpClient.post<string>(`${this.API_URL}api/User/login/`, formData);
    //const event: any = await lastValueFrom(request$);
    const userExists = await lastValueFrom(request$);
    
    if(userExists){
      alert('Sesión iniciada con éxito');
    }else{
      alert('E-mail o contraseña incorrecto/s');
    }
    
  }
  /*async updateImageList() {
    const request$ = this.httpClient.get<User[]>(`${this.API_URL}api/userlist/`);
    this.users = await lastValueFrom(request$);
  }*/
}
interface User {
  email: string;
  password: string;
}
