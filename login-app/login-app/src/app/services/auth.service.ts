import { UsuarioModel } from './../models/usuario.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apiKey = 'AIzaSyBCdRoyBnoj2CzigZ1yBx0YgeaRC0Dtpos';

  //crear nuevo usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  constructor(private http: HttpClient) { 
    this.readToken();
  }

  userToken: string;

  logOut(){
    localStorage.removeItem('token');
  }

  login(usuario: UsuarioModel){
    const usuarioData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(`${ this.url }/accounts:signInWithPassword?key=${this.apiKey}`,usuarioData)
                    .pipe(map((response: any) => {
                      this.saveToken(response.idToken);
                      return response;
                    }));
  }

  registrarUsuario(usuario: UsuarioModel){
    const usuarioData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(`${this.url}/accounts:signUp?key=${this.apiKey}`,usuarioData)
                    .pipe(map((response: any) => {
                      this.saveToken(response.idToken);
                      return response;
                    }));

  }


  private saveToken(idToken: string){
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setTime(3600);

    localStorage.setItem('expira', hoy.getTime().toString());
  }

  private readToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    }else{
      this.userToken = '';
    }
  }

  estaAutenticado(): boolean{
    if(this.userToken.length < 2){
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);
    if(expiraDate > new Date()){
      return true;
    }else{
      return false;
    }
  }
}
