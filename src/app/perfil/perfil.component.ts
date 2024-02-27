import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../servicio.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { User } from '../model/User';

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
      this.getUser()
    }
  }
  idUser = localStorage.getItem("ID") ||sessionStorage.getItem("ID") || '';
  user: any;
  API_URL : string = 'https://localhost:7093/';

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

}
