import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { UsuarioModel } from './../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  isVisible: boolean;
  infoText: string;
  alertRole: string;
  recordarme: boolean = false;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    this.isVisible = false;
    this.alertRole = 'alert';

    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }
  }

  loginUser(formLogin: NgForm){
    if(formLogin.invalid) return;
    
    this.isVisible = true;
    this.infoText = 'Espere por favor, validando la información';
    this.auth.login(this.usuario).subscribe(response => {
      console.log(response);
      this.isVisible = false;
      this.router.navigateByUrl('/home');
      if(this.recordarme){
        localStorage.setItem('email', this.usuario.email);
      }
    },(err) => {
      this.infoText = err.error.error.message;
      console.log(err.error.error.message);
    });
  }

}
