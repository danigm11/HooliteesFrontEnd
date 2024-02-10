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
      password: ['', Validators.required],
      recordar: ['',]
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
      console.log(event);
      if(this.myForm.get('recordar')?.value){
        this.setLocal(event);
      }else{
        this.setSession(event);
      }
      
      this.router.navigate(['/']);
    }catch(error){
      alert('E-mail o contraseña incorrecto/s');
    } 
  }
  setSession(event: string){
    sessionStorage.setItem("JWT",event);
    sessionStorage.setItem("ID","1");
  }
  setLocal(event: string){
    localStorage.setItem("JWT",event);
    localStorage.setItem("ID","1");
  }
}
interface User {
  email: string;
  password: string;
}
