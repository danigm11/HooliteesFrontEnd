import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(private httpClient: HttpClient,private formBuilder: FormBuilder,private router: Router) {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

 async uploadCredentials() {
    const formData = new FormData();
    const options: any = {responseType:"text"};
    formData.append('email', this.myForm.get('email')?.value);
    formData.append('password', this.myForm.get('password')?.value);

    try{
      const request$ = this.httpClient.post<string>(`${this.API_URL}api/User/login/`, formData,options);
      const event: any = await lastValueFrom(request$);
      
      alert('Sesión iniciada con éxito');
      this.router.navigate(['/']);
      console.log(event);
    }catch(error){
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
