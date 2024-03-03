import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

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
      var event: any = await lastValueFrom(request$);
      
      alert('Sesión iniciada con éxito');
      event=JSON.parse(event)
      if(this.myForm.get('recordar')?.value){
        this.setLocal(event.stringToken,event.id);
      }else{
        this.setSession(event.stringToken,event.id);
      }
      this.router.navigate(['/']).then(() => {
        window.location.href = window.location.href;
      });
    }catch(error){
      alert('E-mail o contraseña incorrecto/s');
    } 
  }
  setSession(token: string,id:string){
    sessionStorage.setItem("JWT",token);
    sessionStorage.setItem("ID",id);
  }
  setLocal(token: string,id:string){
    localStorage.setItem("JWT",token);
    localStorage.setItem("ID",id);
  }
}
interface User {
  email: string;
  password: string;
}
